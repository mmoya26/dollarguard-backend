import { IsString, IsNotEmpty, MaxLength } from "class-validator"

export class UpdateUserPreferencesDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(15, {message: 'Category name should be 15 characters or less'})
    name: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(8, {message: 'Hex color should be 8 characters or less'})
    hexColor: string
}


export class AddCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    hexColor: string
}