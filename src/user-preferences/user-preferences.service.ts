import { Injectable } from '@nestjs/common';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserPreferences } from './schemas/user-preferences.schema';
import { Model, Types } from 'mongoose';
import { Category } from '@interfaces/category';

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
  constructor(@InjectModel(UserPreferences.name) private readonly userPreferenceModel: Model<UserPreferences>) {}

  async createDefaultUserPreferences() {
    
    const newUserPreference = await this.userPreferenceModel.create({
      categories: defaultCategories
    });

    return await newUserPreference.save();
  }

  async deletePreferenceCategory(preferenceId: string, categoryId: string) {
    return await this.userPreferenceModel.findOneAndUpdate({_id: new Types.ObjectId(preferenceId)}, {$pull: {categories: {_id: categoryId}}}, {new: true}).exec();
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
