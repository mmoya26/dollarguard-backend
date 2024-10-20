import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { UserPreferencesModule } from 'src/user-preferences/user-preferences.module';
import { UserController } from './users.controller';

@Module({
  imports: [
    UserPreferencesModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService]
})
export class UsersModule {}
