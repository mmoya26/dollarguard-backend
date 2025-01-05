import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/decorators/user.decorator';
import { UserJWTPayload } from '@interfaces/UserJWTPayload';
import { AddCategoryDto } from './dto/user-preferences-categories-dto';
import { NewBudgetDto } from './dto/user-preferences-budgets';
import { isValidMonth } from '@helpers/dateFunctions';
import { UserPreferencesActiveYearsDto } from './dto/user-preferences-active-years.dto';

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

  @Patch('budgets')
  async setOrUpdateUserDto(@User() user: UserJWTPayload, @Body() newBudget: NewBudgetDto) {
    if (!isValidMonth(newBudget.month)) throw new HttpException('Month is not valid', HttpStatus.BAD_REQUEST);
    await this.userPreferencesService.setOrUpdateUserBudget(user, newBudget);
    return { message: "Budget updated/set successfully" }
  }

  @Get('budgets/:year/:month')
  async gerUserBudgets(@User() user: UserJWTPayload, @Param('year') year: string, @Param('month') month: string) {
    if (!isValidMonth(month)) throw new HttpException('Month is not valid', HttpStatus.BAD_REQUEST);
    return this.userPreferencesService.getUserBudget(user, year, month);
  }

  @Get('active-years')
  async getUserActiveYears(@User() user: UserJWTPayload) {
    return this.userPreferencesService.getUserActiveYears(user);
  }

  @Patch('active-years')
  async updateUserActiveYears(@User() user: UserJWTPayload, @Body() year: UserPreferencesActiveYearsDto) {
    return this.userPreferencesService.updateUserActiveYears(user, year);
  }
}
