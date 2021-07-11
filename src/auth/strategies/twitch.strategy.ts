import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '@d-fischer/passport-twitch';
import { TwitchProfile } from '../models/TwitchProfile';
import { ConfigService } from '@nestjs/config';
import { v5 as uuidv5 } from 'uuid';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('TWITCH_CLIENT_ID'),
      clientSecret: configService.get<string>('TWITCH_CLIENT_SECRET'),
      callbackURL: configService.get<string>('TWITCH_CALLBACK_URL'),
      scope: configService.get<string>('TWITCH_SCOPE'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: TwitchProfile,
    done: any,
  ): Promise<void> {
    // "find or create" method could go here
    const id = uuidv5(profile.id, '0296496c-e1a6-11eb-ba80-0242ac130004');

    const user = await this.usersService.findById(id);
    if (user) {
      // account already exists
      return done(null, user);
    }

    // create new account with "twitch" as provider
    const newUser = await this.usersService.createUser(
      profile.login,
      'twitch',
      null,
      id,
    );

    return done(null, newUser);
  }
}
