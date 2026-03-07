import { IsOptional, IsString } from 'class-validator';

export class UploadDto {
  @IsOptional()
  @IsString()
  publicId?: string;

  @IsOptional()
  @IsString()
  folder?: string;
}
