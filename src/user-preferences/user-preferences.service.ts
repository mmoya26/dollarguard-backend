import { Injectable } from '@nestjs/common';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';

@Injectable()
export class UserPreferencesService {
  create(createUserPreferenceDto: CreateUserPreferenceDto) {
    return 'This action adds a new userPreference';
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
