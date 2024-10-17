import { Injectable } from '@nestjs/common';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserPreference } from './schemas/user-preference.schema';
import { Model } from 'mongoose';
import { Category } from '@interfaces/category';

const defaultCategories: Category[] = [
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
  constructor(@InjectModel(UserPreference.name) private readonly userPreferenceModel: Model<UserPreference>) {}

  async createDefaultUserPreferences(userId: string) {

    console.log('Creating user preferences with ID: ' + userId);
    
    const newUserPreference = await this.userPreferenceModel.create({
      userId,
      categories: defaultCategories
    });

    return await newUserPreference.save();
  }

  findAll() {
    return `This action returns all userPreferences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userPreference`;
  }

  update(id: number, updateUserPreferenceDto: UpdateUserPreferenceDto) {
    return `This action updates a #${id} userPreference`;
  }

  remove(id: number) {
    return `This action removes a #${id} userPreference`;
  }
}
