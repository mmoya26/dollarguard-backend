import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import mongoose from 'mongoose';
import { User } from 'src/decorators/user.decorator';
import { UserJWTPayload } from '@interfaces/UserJWTPayload';
import { AddCategoryDto } from './dto/user-preferences-categories-dto';

@Controller('user-preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) { }

  @Delete('categories/:categoryName')
  async deleteUserCategory(@Param('categoryName') categoryName: string, @User() user: UserJWTPayload) {
    const categories = await this.userPreferencesService.deleteCategory(user, categoryName);
    return categories;
  }

  @Post('categories')
  async addUserCategory(@Body() category: AddCategoryDto, @User() user: UserJWTPayload) {
    const categories = await this.userPreferencesService.addNewCategory(category, user);
    return categories;
  }

  @Get('categories')
  async getUserCategories(@User() user: UserJWTPayload) {
    return await this.userPreferencesService.getUserCategories(user);
  }
}
