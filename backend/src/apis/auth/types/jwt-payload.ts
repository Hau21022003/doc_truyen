import { UserRole } from '@/apis/users/entities/user.entity';

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
  timezone: string;
};
