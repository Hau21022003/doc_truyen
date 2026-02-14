import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  client_url: process.env.CLIENT_URL,
  admin_url: process.env.ADMIN_URL,
}));
