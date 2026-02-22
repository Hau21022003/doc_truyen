import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-genre.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {}
