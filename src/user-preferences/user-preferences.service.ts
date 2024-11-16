import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddCategoryDto } from './dto/user-preferences-categories-dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserPreferences } from './schemas/user-preferences.schema';
import { Model, Types } from 'mongoose';
import { Category } from '@interfaces/category';
import { UserJWTPayload } from '@interfaces/UserJWTPayload';

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
      categories: defaultCategories
    });

    return await newUserPreference.save();
  }

  async deleteCategory(user: UserJWTPayload, categoryName: string) {
    const category = await this.userPreferencesModel.findOne(
      { userId: user.id, 'categories.name': categoryName }, // Find by userId and the category._id
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
                id: { $toString: "$$cat._id" },
                name: "$$cat.name",
                hexColor: "$$cat.hexColor",
                _id: "$$REMOVE"
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
            id: { $toString: "$$cat._id" },  // Convert ObjectId to string
            name: "$$cat.name",
            hexColor: "$$cat.hexColor",
            _id: "$$REMOVE"  // This explicitly removes the _id field
          }
        }
      }
    }).lean();

    if (!preferences) return new HttpException("User preferences - categories: not found", HttpStatus.NOT_FOUND);

    return preferences.categories
  }
}
