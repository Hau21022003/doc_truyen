import { Module } from '@nestjs/common';
import { IsUniqueConstraint } from '../decorators/is-unique.decorator';
import { IsExistConstraint } from '../decorators/is-exist.decorator';
import { IsStrongPasswordConstraint } from '../decorators/is-strong-password.decorator';
import { IsSlugConstraint } from '../decorators/is-slug.decorator';
import { IsFutureDateConstraint } from '../decorators/is-future-date.decorator';

@Module({
  providers: [
    IsUniqueConstraint,
    IsExistConstraint,
    IsStrongPasswordConstraint,
    IsSlugConstraint,
    IsFutureDateConstraint,
  ],
  exports: [
    IsUniqueConstraint,
    IsExistConstraint,
    IsStrongPasswordConstraint,
    IsSlugConstraint,
    IsFutureDateConstraint,
  ],
})
export class ValidationProvidersModule {}
