import { StringDoesNotStartOrEndWithWhitespace } from "@validators/StringDoesNotStartOrEndWithWhitespace.decorator"
import { StringHasMultipleConsecutiveSpaces } from "@validators/StringHasMultipleConsecutiveSpaces.decorator"
import { IsString, IsNotEmpty } from "class-validator"

export class AddCategoryDto {
    @IsString()
    @IsNotEmpty()
    @StringHasMultipleConsecutiveSpaces()
    @StringDoesNotStartOrEndWithWhitespace()
    name: string

    @IsString()
    @IsNotEmpty()
    hexColor: string
} 