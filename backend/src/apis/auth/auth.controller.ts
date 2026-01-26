import { Controller, Post, Body, Res, Get, UseGuards, Req } from '@nestjs/common';
import { CookieOptions, type Response } from 'express';
import { type Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AppConfigService } from '@/config/app-config.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { ApiBody, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: AppConfigService,
  ) {}

  private setCookies(response: Response, tokens: any) {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    };

    response.cookie('access_token', tokens.accessToken, {
      ...cookieOptions,
      maxAge: this.configService.jwtAccessExpiresInMs,
    });

    response.cookie('refresh_token', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: this.configService.jwtRefreshExpiresInMs,
      path: '/auth/refresh',
    });
  }

  @Public()
  @Post('login')
  @ApiCookieAuth('access_token')
  @ApiBody({ type: AuthDto })
  async login(@Body() authDto: AuthDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(authDto);
    this.setCookies(response, result);
    // return result.account;
    return {
      account: result.account,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    // This route initiates the Google OAuth flow
    // Passport will redirect to Google
  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.googleLogin(req);
    this.setCookies(response, result);
    return response.redirect(this.configService.clientUrl);
  }
}
