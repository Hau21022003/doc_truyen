import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error status',
    example: 'error',
  })
  status: string;

  @ApiProperty({
    description: 'Error message',
    example: 'Something went wrong',
  })
  message: string;

  @ApiProperty({
    description: 'Error details',
    example: 'Validation failed',
  })
  error?: string;
}