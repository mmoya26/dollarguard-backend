import { IsNotEmpty, IsNumber, IsNumberString, Matches, Max, Min } from "class-validator";

export class UserPreferencesActiveYearsDto {
    @IsNumber()
    @IsNotEmpty()
    @Min(1000)  // 4-digit minimum
    @Max(9999)  // 4-digit maximum
    year: number;
}