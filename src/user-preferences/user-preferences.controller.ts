import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';

@Controller('user-preferences')
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) {}

  @Post()
  create(@Body() createUserPreferenceDto: CreateUserPreferenceDto) {
    return this.userPreferencesService.create(createUserPreferenceDto);
  }

  @Get()
  findAll() {
    return this.userPreferencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userPreferencesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserPreferenceDto: UpdateUserPreferenceDto) {
    return this.userPreferencesService.update(+id, updateUserPreferenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPreferencesService.remove(+id);
  }
}
