import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import mongoose from 'mongoose';

@Controller('user-preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) {}

  @Delete(':preferenceId/:categoryId')
  async deleteUserCategory(@Param('preferenceId') preferenceId: string, @Param('categoryId') categoryId: string) {
    const isPreferenceIdValid = mongoose.Types.ObjectId.isValid(preferenceId);
    const isCategoryIdValid = mongoose.Types.ObjectId.isValid(categoryId);

    if (!isPreferenceIdValid) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    if (!isCategoryIdValid) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const updatedPreferences = await this.userPreferencesService.deletePreferenceCategory(preferenceId, categoryId);

    return updatedPreferences;
  }
}
