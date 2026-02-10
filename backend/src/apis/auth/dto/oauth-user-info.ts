import { AuthProvider } from '@/apis/users/entities/user.entity';

export interface OAuthUserInfo {
  email: string;
  name: string;
  avatar?: string;
  providerId: string;
  provider: AuthProvider;
}
