import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddCategoryDto } from './dto/user-preferences-categories-dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserPreferences } from './schemas/user-preferences.schema';
import { Model, Types } from 'mongoose';
import { Category } from '@interfaces/category';
import { UserJWTPayload } from '@interfaces/UserJWTPayload';
import { NewBudgetDto } from './dto/user-preferences-budgets';
import { UserPreferencesActiveYearsDto } from './dto/user-preferences-active-years.dto';
import { ExpensesService } from '@/expenses/expenses.service';

@Injectable()
export class UserPreferencesService {
  constructor(@InjectModel(UserPreferences.name) private readonly userPreferencesModel: Model<UserPreferences>, private readonly expensesService: ExpensesService) { }

  async createDefaultUserPreferences(userId: string) {

    const newUserPreference = await this.userPreferencesModel.create({
      userId
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

    const preferences = await this.userPreferencesModel.findOne({ userId: user.id });

    if (!preferences) {
      throw new HttpException("User preferences - categories: not found", HttpStatus.NOT_FOUND);
    }

    const categoryExists = preferences.categories.some((cat) => cat.name.toLocaleLowerCase() === category.name.toLocaleLowerCase());

    if (categoryExists) {
      throw new HttpException("Category already exists", HttpStatus.CONFLICT);
    }

    preferences.categories.push(category);

    await preferences.save();

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

    if (!userPreferences.budgets.has(newBudgetDto.year)) {
      userPreferences.budgets.set(newBudgetDto.year, new Map());
    }

    const yearBudget = userPreferences.budgets.get(newBudgetDto.year);

    yearBudget.set(newBudgetDto.month, newBudgetDto.newAmount);

    userPreferences.budgets = Object.fromEntries([...userPreferences.budgets.entries()].map(([year, monthsMap]) => [year, Object.fromEntries([...monthsMap.entries()])])) as any;

    await userPreferences.save();
  }

  async getUserBudget(user: UserJWTPayload, year: string, month: string): Promise<number | null> {
    const userPreferences = await this.userPreferencesModel.findOne({ userId: user.id });

    if (!userPreferences) throw new HttpException("User preferences not found", HttpStatus.NOT_FOUND);

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

  async getUserActiveYears(user: UserJWTPayload): Promise<number[]> {
    const userPreferences = await this.userPreferencesModel.findOne({ userId: user.id });

    if (!userPreferences) throw new HttpException("User preferences not found", HttpStatus.NOT_FOUND);

    /* 
      if the user does not have the active years property present in their collection 
      it stil returns an empty array because of the default value in the schema
    */
    return userPreferences.activeYears;
  }

  async updateUserActiveYears(user: UserJWTPayload, { year }: UserPreferencesActiveYearsDto) {
    const userPreferences = await this.userPreferencesModel.findOne({ userId: user.id });

    if (!userPreferences) throw new HttpException("User preferences not found", HttpStatus.NOT_FOUND);

    if (userPreferences.activeYears.includes(year)) throw new HttpException("Active year already exists", HttpStatus.CONFLICT);

    userPreferences.activeYears.push(year);

    return await userPreferences.save();
  }


  async deleteUserActiveYear(user: UserJWTPayload, { year }: UserPreferencesActiveYearsDto) {
    const userPreferences = await this.userPreferencesModel.findOne({ userId: user.id });

    if (!userPreferences) throw new HttpException("User preferences not found", HttpStatus.NOT_FOUND);

    if (!userPreferences.activeYears.includes(year)) return null;

    userPreferences.activeYears = userPreferences.activeYears.filter(activeYear => activeYear !== year);

    const expensesWithSameActiveYear = await this.expensesService.getExpensesByYear(year, user);

    // if they don't have any expenses for that year return the updated user preferences
    if (expensesWithSameActiveYear.length === 0) {
      const { activeYears } = await userPreferences.save();
      return activeYears;
    }

    for (const expense of expensesWithSameActiveYear) {
      // console.log(`Deleting expense for date: ${expense.date} with ID: ${expense.id as string}`);
      await this.expensesService.deleteExpense(expense.id, user);
    }

    const { activeYears } = await userPreferences.save();
    return activeYears;
  }
}
