import { IsNotEmpty, IsUUID } from 'class-validator';

export class UploadDraftDto {
  @IsNotEmpty()
  @IsUUID()
  tempId: string;
}
