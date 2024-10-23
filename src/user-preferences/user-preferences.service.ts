import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserPreferences } from './schemas/user-preferences.schema';
import { Model, Types } from 'mongoose';
import { Category } from '@interfaces/category';
import { UserJWTPayload } from '@interfaces/UserJWTPayload';

export const defaultCategories: Category[] = [
  { name: "Groceries", hexColor: "#4CAF50" },
  { name: "Gas", hexColor: "#FF9800" },
  { name: "Rent", hexColor: "#3F51B5" },
  { name: "Utilities", hexColor: "#FFEB3B" },
  { name: "Dining Out", hexColor: "#E91E63" },
  { name: "Entertainment", hexColor: "#9C27B0" },
  { name: "Transportation", hexColor: "#009688" },
  { name: "Healthcare", hexColor: "#F44336" },
  { name: "Savings", hexColor: "#2196F3" },
  { name: "Personal Care", hexColor: "#8BC34A"}
];

@Injectable()
export class UserPreferencesService {
  constructor(@InjectModel(UserPreferences.name) private readonly userPreferencesModel: Model<UserPreferences>) {}

  async createDefaultUserPreferences(userId: string) {
    
    const newUserPreference = await this.userPreferencesModel.create({
      userId,
      categories: defaultCategories
    });

    return await newUserPreference.save();
  }

  async deleteCategory(user: UserJWTPayload, categoryId: string) {

    const category = await this.userPreferencesModel.findOne(
      { userId: user.id, 'categories._id': categoryId }, // Find by userId and the category._id
      { 'categories.$': 1 } // Project only the matched category
    );

    if (!category) throw new HttpException('Category not found', HttpStatus.NOT_FOUND)

    return this.userPreferencesModel.updateOne(
      { userId: user.id }, 
      { $pull: { categories: { _id: categoryId } } }
    ).exec();
  }

  findAll() {
    return `This action returns all userPreferences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userPreference`;
  }

  update(id: number, updateUserPreferenceDto: UpdateUserPreferencesDto) {
    return `This action updates a #${id} userPreference`;
  }

  remove(id: number) {
    return `This action removes a #${id} userPreference`;
  }
}
