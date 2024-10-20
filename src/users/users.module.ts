import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { UserPreferences, UserPreferencesSchema } from 'src/user-preferences/schemas/user-preferences.schema';
import { UserPreferencesModule } from 'src/user-preferences/user-preferences.module';

@Module({
  imports: [
    UserPreferencesModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
    MongooseModule.forFeature([{ name: UserPreferences.name, schema: UserPreferencesSchema }])],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
