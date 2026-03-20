import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseUUIDsPipe implements PipeTransform<string, string[]> {
  transform(value: string): string[] {
    if (!value) {
      throw new BadRequestException('ids is required');
    }

    const ids = value.split(',');

    if (ids.length === 0) {
      throw new BadRequestException('ids cannot be empty');
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const invalidIds = ids.filter((id) => !uuidRegex.test(id));

    if (invalidIds.length > 0) {
      throw new BadRequestException({
        message: 'Invalid UUIDs',
        invalidIds,
      });
    }

    return ids;
  }
}
