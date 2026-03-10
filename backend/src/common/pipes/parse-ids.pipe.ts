import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIdsPipe implements PipeTransform<string, number[]> {
  transform(value: string): number[] {
    if (!value) {
      throw new BadRequestException('ids is required');
    }

    const ids = value.split(',').map((v) => Number(v));

    if (ids.some((id) => Number.isNaN(id))) {
      throw new BadRequestException('ids must be numbers');
    }

    if (ids.length === 0) {
      throw new BadRequestException('ids cannot be empty');
    }

    return ids;
  }
}
