import { Controller, Post, Body, Res, Get, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { CookieOptions, type Response } from 'express';
import { type Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AppConfigService } from '@/config/app-config.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { ApiBody, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { type JwtPayload } from './types/jwt-payload';
import { UsersService } from '../users/users.service';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
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

  private clearCookies(response: Response) {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    };

    response.clearCookie('access_token', { ...cookieOptions });
    response.clearCookie('refresh_token', {
      ...cookieOptions,
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
    return result.account;
  }

  @Public()
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiCookieAuth('refresh_token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: JwtPayload,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    const tokens = await this.authService.refreshTokens(user.sub, refreshToken);
    this.setCookies(response, tokens);

    return { message: 'Tokens refreshed' };
  }

  @Post('logout')
  @ApiCookieAuth('access_token')
  async logout(@Req() req: Request, @Res({ passthrough: true }) response: Response, @CurrentUser() user: JwtPayload) {
    const refreshToken = req.cookies?.refresh_token;

    await this.authService.logout(user.sub, refreshToken);
    this.clearCookies(response);
    return { message: 'Logged out successfully' };
  }

  @Post('logout-all')
  @ApiCookieAuth('access_token')
  async logoutAll(@Res({ passthrough: true }) response: Response, @CurrentUser() user: JwtPayload) {
    await this.authService.logout(user.sub);
    this.clearCookies(response);
    return { message: 'Logged out from all devices' };
  }

  @Get('devices')
  @ApiCookieAuth('access_token')
  async getActiveDevices(@CurrentUser() user: JwtPayload) {
    return await this.usersService.getActiveDevices(user.sub);
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
