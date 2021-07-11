import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { TokenPair } from './models/TokenPair';
import { TokenPayload } from './models/TokenPayload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validatePassword(
    username: string,
    password: string,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const user = await this.usersService.findByName(username);
    if (!user || user.provider !== 'local') return null;

    try {
      const matches = await argon2.verify(user.hashedPassword, password);
      if (!matches) {
        console.log('no match');
        return null;
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }

    // user entered correct password
    const { hashedPassword, ...rest } = user; // trip pw off rest user obj
    return rest;
  }

  // This method will only be called after validatePassword within the AuthGuard was successfull
  // so we know that the user passed into login is already authorized
  async login(user: User): Promise<TokenPair> {
    const p: TokenPayload = {
      username: user.name,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(p),
      refreshToken: this.jwtService.sign(p, { expiresIn: '14d' }),
    };
  }

  async register(registerDto: RegisterDto): Promise<TokenPair> {
    const { username, password } = registerDto;

    const u: User = await this.usersService.findByName(username);
    if (u) {
      const errM = `User with the name ${username}, already exists`;
      throw new ConflictException({ error: errM }, errM);
    }

    const hashedPw = await argon2.hash(password).catch((e) => {
      console.log('error hashing a users password: ', e);
      throw new InternalServerErrorException();
    });

    const savedUser = await this.usersService.createUser(
      username,
      'local',
      hashedPw,
    );

    const p: TokenPayload = {
      sub: savedUser.id,
      username: savedUser.name,
    };
    return {
      accessToken: this.jwtService.sign(p),
      refreshToken: this.jwtService.sign(p, { expiresIn: '14d' }),
    };
  }

  // called after the twitch oauth process was successfull, and validate function of twitch passport strategy
  // finished successfully
  async loginTwitch(user: User): Promise<TokenPair> {
    if (!user) throw new UnauthorizedException();

    // create access token payload from the given twitch profile
    const p: TokenPayload = {
      sub: user.id,
      username: user.name,
    };
    return {
      accessToken: this.jwtService.sign(p),
      refreshToken: this.jwtService.sign(p, { expiresIn: '14d' }),
    };
  }

  // Promise returns true if token is valid, false if its blacklisted
}
