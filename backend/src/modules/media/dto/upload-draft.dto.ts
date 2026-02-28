import { IsNotEmpty, IsUUID } from 'class-validator';

export class UploadDto {
  @IsNotEmpty()
  @IsUUID()
  tempId: string;
}
