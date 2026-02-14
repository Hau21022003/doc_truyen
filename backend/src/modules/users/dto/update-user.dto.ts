import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

// Note: If we need special validation for updates (like ignoring current user for uniqueness),
// we might need to create a separate DTO instead of using PartialType
