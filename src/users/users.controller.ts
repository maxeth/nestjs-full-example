import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import makeHttpError from 'src/errors/makeHttpErrorResponse';
import { TokensService } from 'src/tokens/tokens.service';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private userSerservice: UsersService,
    private tokenService: TokensService,
  ) {}

  // @Get('auth/twitch/callback')
  // async callback(@Query('code') code: string): Promise<any> {
  //   console.log(code);
  //   const res = await axios
  //     .post(
  //       `https://id.twitch.tv/oauth2/token?client_id=9vr6pfa4gm5usulhi4fe5lobdjehyk&client_secret=4mxn2iezwuxp3p2duuqlil4322dvae&code=${code}&grant_type=authorization_code&redirect_uri=http://localhost:3000/users/auth/twitch/callback`,
  //     )
  //     .catch((err) => {
  //       console.log(err.response.data);
  //       throw new InternalServerErrorException();
  //     });
  //   console.log('res', res.data);
  //   return res.data;
  // }

  // @Get('auth/:provider')
  // @Redirect('', 302)
  // auth(@Param('provider') provider: string) {
  //   switch (provider) {
  //     case 'twitch':
  //       return {
  //         url:
  //           'https://id.twitch.tv/oauth2/authorize?client_id=9vr6pfa4gm5usulhi4fe5lobdjehyk&redirect_uri=http://localhost:3000/users/auth/twitch/callback&response_type=code&scope=user:read:email%20openid&claims={"id_token":{"email":null,"email_verified":null},"userinfo":{"picture":null}}',
  //       };
  //     default:
  //       return { url: '/test' };
  //   }
  // }

  @Get('data')
  getUsers(@Query('name') name?: string): Array<User> {
    console.log(name);
    return null;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    // parse the user object TODO
    let user: User;
    try {
      user = await this.userSerservice.findById(id);
    } catch (err) {
      console.log(err);
      if (err.name in HttpStatus) {
        throw makeHttpError(parseInt(err.name), err.message);
      }
      throw makeHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Unexpected error occured',
      );
    }
    return user;
  }
}
