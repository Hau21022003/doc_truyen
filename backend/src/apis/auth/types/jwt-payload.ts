import { UserRole } from '@/apis/users/entities/user.entity';
import { TimezoneValue } from '@/common/constants/timezone.constant';

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
  timezone: TimezoneValue;
};
