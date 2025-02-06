import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { hasMultipleSpaces } from '@/helpers/hasMultipleSpaces';

@ValidatorConstraint({ async: false })
class StringHasMultipleConsecutiveSpacesConstraint implements ValidatorConstraintInterface {
  validate(str: string , args: ValidationArguments) {
    if (typeof str !== 'string') return false;
    if (str === '') return false;
    
    return !hasMultipleSpaces(str);
  }

  defaultMessage(args: ValidationArguments) {
    return 'The category name must not contain multiple consecutive spaces';
  }
}

export function StringHasMultipleConsecutiveSpaces(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: StringHasMultipleConsecutiveSpacesConstraint,
    });
  };
}