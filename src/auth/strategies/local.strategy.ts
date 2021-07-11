import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const user = await this.authService.validatePassword(username, password);
    if (!user) throw new UnauthorizedException();

    return user; // this user will be attached to req.user for the lifetime of this lopgin request (since in the future we will use JWT guards instead of LocalGuards for authorization)
    // the req.user will be used to create a access/refresh token in the auth service "login" method, that will be returned as a request response for the login request
  }
}
