import { Body, Controller, Get, Param, Post, Delete, HttpException, Patch, HttpStatus, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpenseDto } from './dto/expense.dto';
import { ExpenseParams } from '../interfaces/expenseParams';
import mongoose from 'mongoose';
import { isValidDate, isValidMonth } from '@helpers/dateFunctions';
import { User } from 'src/decorators/user.decorator';
import { UserJWTPayload } from '@interfaces/UserJWTPayload';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get(':year/:month')
  async getExpensesByYearAndMonth(@Param() params: ExpenseParams, @User() user) {
    if (!isValidMonth(params.month)) throw new HttpException('Unable to get expenses', HttpStatus.BAD_REQUEST);
    return this.expensesService.getExpensesByYearAndMonth(params, user);
  }

  @Post(':year/:month')
  async createExpense(@Param() params: ExpenseParams, @Body() createExpenseDto: ExpenseDto, @User() user: UserJWTPayload) {
    if (!isValidDate(createExpenseDto.monthDay, Number(params.month) - 1, params.year)) throw new HttpException('Expense could not be added', HttpStatus.BAD_REQUEST);

    return await this.expensesService.create(createExpenseDto, params, user);
  }

  @Delete(':id')
  async deleteExpense(@Param('id') id: string, @User() user) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const deletedExpense = await this.expensesService.deleteExpense(id, user) 
    if (!deletedExpense) throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
  }

  @Patch(':id')
  async updateExpense(@Param('id') expenseId, @Body() updateExpenseDto: ExpenseDto, @User() user: UserJWTPayload) {
    const isValidId = mongoose.Types.ObjectId.isValid(expenseId);
    if (!isValidId) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const updatedExpense =  await this.expensesService.updateExpense(expenseId, updateExpenseDto, user);
    if (!updatedExpense) throw new HttpException('Unable to update expense', HttpStatus.BAD_REQUEST);

    return updatedExpense;
  }
}