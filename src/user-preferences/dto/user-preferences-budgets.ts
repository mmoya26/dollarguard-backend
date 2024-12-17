import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class NewBudgetDto {
    @IsString()
    @IsNotEmpty()
    year: string

    @IsString()
    @IsNotEmpty()
    month: string

    @IsNumber()
    @IsNotEmpty()
    amount: number
}