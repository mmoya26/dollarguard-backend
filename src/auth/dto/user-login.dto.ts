import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserLoginDto {
    @IsEmail()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}