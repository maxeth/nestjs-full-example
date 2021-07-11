import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt.guards';
import { LocalAuthGuard } from './guards/local.guard';
import { TokenPair } from './models/TokenPair';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req): Promise<TokenPair> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<TokenPair> {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('twitch')) // starts passports twitch oauth process. -> redirects to twitch, then back to twitch/callback
  @Get('twitch/login')
  async twitchLogin() {
    console.log('starting passport twitch oauth process.');
  }

  @UseGuards(AuthGuard('twitch'))
  @Get('twitch/callback')
  async twitchLoginRedirect(@Req() req) {
    console.log('user in callback is ', req.user);
    return this.authService.loginTwitch(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('testProtected')
  testProtected(@Req() req) {
    console.log(req.user);
    return 'user authorized';
  }
}
