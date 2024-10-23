import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import mongoose from 'mongoose';
import { User } from 'src/decorators/user.decorator';
import { UserJWTPayload } from '@interfaces/UserJWTPayload';

@Controller('user-preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) {}

  @Delete('categories/:categoryId')
  async deleteUserCategory(@Param('categoryId') categoryId: string, @User() user: UserJWTPayload) {
    const isCategoryIdValid = mongoose.Types.ObjectId.isValid(categoryId);

    if (!isCategoryIdValid) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const updatedPreferences = await this.userPreferencesService.deleteCategory(user, categoryId);

    return updatedPreferences;
  }
}
