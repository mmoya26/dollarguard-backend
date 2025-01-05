import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class UserPreferencesActiveYearsDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{4}$/, { 
        message: 'Year must be exactly 4 digits with no whitespace or special characters' 
    })
    year: string;
}