import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { startsOrEndsWithWhitespace } from '@/helpers/startsOrEndsWithWhitespace';

@ValidatorConstraint({ async: false })
class StringDoesNotStartOrEndWithWhitespaceConstraint implements ValidatorConstraintInterface {
  validate(str: string , args: ValidationArguments) {
    if (typeof str !== 'string') return false;
    if (str === '') return false;
    
    return !startsOrEndsWithWhitespace(str);
  }

  defaultMessage(args: ValidationArguments) {
    return 'The category name must not contain leading or trailing spaces';
  }
}

export function StringDoesNotStartOrEndWithWhitespace(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: StringDoesNotStartOrEndWithWhitespaceConstraint,
    });
  };
}