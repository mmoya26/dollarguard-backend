import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseModule } from './expenses/expenses.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserPreferencesModule } from './user-preferences/user-preferences.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.NODE_ENV === 'production' ? process.env.MONGODB_PROD : 'mongodb://localhost/dollarguard'), 
    ExpenseModule, 
    AuthModule, UserPreferencesModule]
})
export class AppModule {}
