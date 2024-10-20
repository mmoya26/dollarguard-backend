import { Controller, Get, HttpException, HttpStatus, Param, UseGuards } from "@nestjs/common";
import mongoose from "mongoose";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { UsersService } from "./users.service";

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UsersService) {}

    @Get(':id')
    async findUserById(@Param('id') id: string) {
        const isValidId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidId) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

        const user = await this.userService.findUserById(id);
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return user;
    } 
}