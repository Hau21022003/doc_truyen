import { AppConfigService } from '@/config/app-config.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly configService: AppConfigService) {
    super({
      clientID: configService.facebookClientId,
      clientSecret: configService.facebookClientSecret,
      callbackURL: configService.facebookCallbackURL,
      profileFields: ['id', 'emails', 'name', 'photos'],
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const name = profile.displayName || `${profile.name?.familyName} ${profile.name?.givenName}` || 'Unknown User';
    const user = {
      facebookId: profile.id,
      email: profile.emails?.[0]?.value,
      name,
      avatar: profile.photos?.[0]?.value,
    };

    done(null, user);
  }
}
