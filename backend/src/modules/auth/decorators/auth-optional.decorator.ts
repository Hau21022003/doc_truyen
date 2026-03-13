import { SetMetadata } from '@nestjs/common';

export const AUTH_OPTIONAL_KEY = 'isAuthOptional';

export const AuthOptional = () => SetMetadata(AUTH_OPTIONAL_KEY, true);
