import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private moduleRef: ModuleRef) {}

  async validate(value: any, args: ValidationArguments) {
    const [entityClass, property = 'id'] = args.constraints;

    try {
      const repository = this.moduleRef.get<Repository<any>>(getRepositoryToken(entityClass), { strict: false });

      if (!repository) return false;

      const record = await repository.findOne({ where: { [property]: value } });

      return !record;
    } catch (error) {
      console.error(`Validation error for ${entityClass.name}.${property}:`, error);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [entityClass, property = 'id'] = args.constraints;
    return `${property} '${args.value}' đã tồn tại`;
  }
}

export function IsUnique<T>(entityClass: new () => T, property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityClass, property],
      validator: IsUniqueConstraint,
    });
  };
}
