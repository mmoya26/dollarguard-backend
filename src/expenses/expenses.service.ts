import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExpenseDto } from './dto/expense.dto';
import { Expense } from "./schemas/expense.schema";
import { Expense as IExpense} from "@interfaces/expense";
import { ExpenseParams } from '../interfaces/expenseParams';
import { isValidDate } from '@helpers/dateFunctions';
import { UserJWTPayload } from '@interfaces/UserJWTPayload';

@Injectable()
export class ExpensesService {
  constructor(@InjectModel(Expense.name) private readonly expenseModel: Model<Expense>) { }

  async create(createExpenseDto: ExpenseDto, { year, month }: ExpenseParams, user: UserJWTPayload): Promise<IExpense> {
    const newExpense = new this.expenseModel({...createExpenseDto, userId: user.id});
    newExpense.date = new Date(`${month}/${createExpenseDto.monthDay}/${year}`);

    return await newExpense.save();
  }

  async getExpenseById(id: string): Promise<Expense> {
    return this.expenseModel.findById(id);
  }

  async getExpensesByYearAndMonth({ year, month }: ExpenseParams, user: UserJWTPayload): Promise<IExpense[]> {
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    return this.expenseModel.find({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      userId: user.id
    });
  }

  async getExpensesByYear(year: number, user: UserJWTPayload): Promise<IExpense[]> {
    const startDate = new Date(Number(year), 0, 1);
    const endDate = new Date(Number(year), 11, 31);

    return this.expenseModel.find({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      userId: user.id
    });
  }

  async updateExpense(expenseId: string, expenseDto: ExpenseDto, user: UserJWTPayload) {
    const foundRecord = await this.expenseModel.findById(expenseId);
    
    if (!foundRecord) return null
    
    const currentExpenseYear = foundRecord.date.getFullYear();
    const currentExpenseMonth = foundRecord.date.getMonth() + 1; // Add + 1 because the return value will based on index 0

    // Subtract 1 from currentExpenseMonth to check if it is a valid date because the function is based on index 0
    // so march for example will actually be index 2 instead of 3.
    if (!isValidDate(expenseDto.monthDay, currentExpenseMonth - 1, currentExpenseYear)) {
      return null;
    }

    const newUpdatedExpenseDate = new Date(`${currentExpenseYear}/${currentExpenseMonth}/${expenseDto.monthDay}`);

    return this.expenseModel.findOneAndUpdate({userId: user.id, _id: new Types.ObjectId(expenseId)}, { ...expenseDto, date: newUpdatedExpenseDate, userId: user.id}, {new: true});
  }

  async deleteExpense(id: string, user: UserJWTPayload) {
    return this.expenseModel.findOneAndDelete({userId: user.id, _id: new Types.ObjectId(id)})
  }
}