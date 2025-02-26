import { Module } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesController } from './user-preferences.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPreferences, UserPreferencesSchema } from './schemas/user-preferences.schema';
import { ExpensesService } from '@/expenses/expenses.service';
import { ExpenseModule } from '@/expenses/expenses.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserPreferences.name, schema: UserPreferencesSchema }]), ExpenseModule],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService],
  exports: [UserPreferencesService]
})
export class UserPreferencesModule {}
