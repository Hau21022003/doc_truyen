import { AppConfigService } from '@/config/app-config.service';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CookieOptions, type Request, type Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto, RegisterDto } from './dto';
import { FacebookAuthGuard, GoogleOauthGuard, RefreshTokenGuard } from './guards';
import { type JwtPayload } from './types/jwt-payload';

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
  @ApiBody({ type: LoginDto })
  async login(@Body() authDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(authDto);
    this.setCookies(response, result);
    return result.account;
  }

  @Public()
  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() authDto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(authDto);
    this.setCookies(response, result);
    return result.account;
  }

  @Get('profile')
  async findProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.findByEmail(user.email);
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

  @Get('logout')
  @ApiCookieAuth('access_token')
  async logout(@Req() req: Request, @Res({ passthrough: true }) response: Response, @CurrentUser() user: JwtPayload) {
    const refreshToken = req.cookies?.refresh_token;

    console.log('log out', refreshToken);
    await this.authService.logout(user.sub, refreshToken);
    this.clearCookies(response);
    return { message: 'Logged out successfully' };
  }

  @Get('logout-all')
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

  @Public()
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    // This route initiates the Google OAuth flow
    // Passport will redirect to Google
  }

  @Public()
  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.googleLogin(req);
    this.setCookies(response, result);
    return response.redirect(this.configService.clientUrl);
  }

  @Public()
  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookLogin() {}

  @Public()
  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookCallback(@Req() req, @Res({ passthrough: true }) response: Response) {
    const user = req.user;
    const result = await this.authService.facebookLogin(user);
    this.setCookies(response, result);
    return response.redirect(this.configService.clientUrl);
  }
}
