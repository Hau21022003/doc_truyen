import { ValidationPipeOptions, ValidationPipe } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));
        return new UnprocessableEntityException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    });
  }
}
