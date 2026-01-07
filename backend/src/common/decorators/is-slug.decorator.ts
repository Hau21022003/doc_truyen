import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isSlug', async: false })
export class IsSlugConstraint implements ValidatorConstraintInterface {
  validate(slug: string, args: ValidationArguments) {
    if (!slug) return false;

    // Chỉ chấp nhận chữ thường, số, và dấu gạch ngang
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang, không có khoảng trắng';
  }
}

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSlugConstraint,
    });
  };
}
