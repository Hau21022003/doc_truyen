import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_OPTIONAL_KEY } from '../decorators/auth-optional.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  // Thêm
  override handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    const isAuthOptional = this.reflector.getAllAndOverride<boolean>(
      AUTH_OPTIONAL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isAuthOptional) {
      // nếu optional → trả null thay vì throw
      if (err || !user) {
        return null;
      }
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
