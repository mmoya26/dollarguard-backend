import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddCategoryDto } from './dto/user-preferences-categories-dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserPreferences } from './schemas/user-preferences.schema';
import { Model, Types } from 'mongoose';
import { Category } from '@interfaces/category';
import { UserJWTPayload } from '@interfaces/UserJWTPayload';
import { NewBudgetDto } from './dto/user-preferences-budgets';

export const defaultCategories: Category[] = [
  {
    name: "Miscellaneous",
    hexColor: "#475569",
  },
  {
    name: "Gas",
    hexColor: "#DC2626",
  },
  {
    name: "Utilities",
    hexColor: "#0891B2",
  },
  {
    name: "Groceries",
    hexColor: "#D97706",
  },
  {
    name: "Phone Bill",
    hexColor: "#4F46E5",
  }
]

@Injectable()
export class UserPreferencesService {
  constructor(@InjectModel(UserPreferences.name) private readonly userPreferencesModel: Model<UserPreferences>) { }

  async createDefaultUserPreferences(userId: string) {

    const newUserPreference = await this.userPreferencesModel.create({
      userId,
      categories: defaultCategories,
      budgets: null
    });

    return await newUserPreference.save();
  }

  async deleteCategory(user: UserJWTPayload, categoryName: string) {
    const category = await this.userPreferencesModel.findOne(
      { userId: user.id, 'categories.name': categoryName },
      { 'categories.$': 1 } // Project only the matched category
    );

    if (!category) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

    await this.userPreferencesModel.updateOne(
      { userId: user.id },
      { $pull: { categories: { name: categoryName } } }
    ).exec();

    const categories = await this.getUserCategories(user);

    return categories
  }

  async addNewCategory(category: AddCategoryDto, user: UserJWTPayload) {
    const preferences = await this.userPreferencesModel.findOneAndUpdate(
      { userId: user.id },
      { $push: { categories: { ...category } } },
      {
        new: true,
        projection: {
          categories: {
            $map: {
              input: "$categories",
              as: "cat",
              in: {
                name: "$$cat.name",
                hexColor: "$$cat.hexColor",
              }
            }
          }
        }
      }
    ).lean();

    if (!preferences) {
      throw new HttpException(
        "User preferences - categories: not found",
        HttpStatus.NOT_FOUND
      );
    }

    if (!preferences) return new HttpException("User preferences - categories: not found", HttpStatus.NOT_FOUND);

    return preferences.categories;
  }


  async getUserCategories(user: UserJWTPayload) {
    const preferences = await this.userPreferencesModel.findOne({ userId: user.id }, {
      categories: {
        $map: {
          input: "$categories",
          as: "cat",
          in: {
            name: "$$cat.name",
            hexColor: "$$cat.hexColor",
          }
        }
      }
    }).lean();

    if (!preferences) return new HttpException("User preferenecs - categories: not found", HttpStatus.NOT_FOUND);

    return preferences.categories
  }

  async setOrUpdateUserBudget(user: UserJWTPayload, newBudgetDto: NewBudgetDto) {
    const userPreferences = await this.userPreferencesModel.findOne({ userId: user.id });

    /* 
      if userPreferences.budgets is null it means they have the property but it is empty (null) 
      if userPreferences.budgets is undefined it means that the property does not exist on the document
    */
    if (userPreferences.budgets === null || userPreferences['budgets'] === undefined) {
      userPreferences.budgets = new Map();
    } else {
      userPreferences.budgets = new Map(Object.entries(userPreferences.budgets));
    }

    if(!userPreferences.budgets.has(newBudgetDto.year)) {
      userPreferences.budgets.set(newBudgetDto.year, new Map());
    }

    const yearBudget = userPreferences.budgets.get(newBudgetDto.year);

    yearBudget.set(newBudgetDto.month, newBudgetDto.newAmount);

    userPreferences.budgets = Object.fromEntries([...userPreferences.budgets.entries()].map(([year, monthsMap]) => [year, Object.fromEntries([...monthsMap.entries()])])) as any;

    await userPreferences.save();
  }

  async getUserBudget(user: UserJWTPayload, year: string, month: string): Promise<number | null> {
    const userPreferences = await this.userPreferencesModel.findOne({ userId: user.id });

    /* 
      if userPreferences.budgets is null it means they have the property but it is empty (null) 
      if userPreferences.budgets is undefined it means that the property does not exist on the document
    */
    if (userPreferences.budgets === null || userPreferences['budgets'] === undefined) return null;

    userPreferences.budgets = new Map(Object.entries(userPreferences.budgets));

    // if the user has no budget set for that year return null
    if (!userPreferences.budgets.has(year)) return null;
    
    const yearBudget = userPreferences.budgets.get(year);

    // if the user has no budget for that month return null
    if (!yearBudget.has(month)) return null;
    
    // if everything else passes return the budget for that month
    return yearBudget.get(month);
  }
}
