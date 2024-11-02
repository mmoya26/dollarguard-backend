import { IsString, IsNotEmpty } from "class-validator"

export class AddCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    hexColor: string
}