import { Inject, InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPair } from 'src/auth/models/TokenPair';
import { TokenPayload } from 'src/auth/models/TokenPayload';
import { RedisConnection } from 'src/datasources/providers/redis.provider';

@Injectable()
export class TokensService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS_CONNECTION') private redis: RedisConnection,
  ) {}
  setRefreshToken(): Promise<'OK'> {
    return this.redis.set('a', 'b');
  }

  makeAccessToken(tp: TokenPayload): string {
    return this.jwtService.sign(tp, { expiresIn: '3m' });
  }

  makeRefreshToken(tp: TokenPayload): string {
    return this.jwtService.sign(tp, { expiresIn: '14d' });
  }

  async makeNewRefreshToken(
    tp: TokenPayload,
    prevTokenId: string,
    prevTokenSecsTTL: number,
  ): Promise<string> {
    // check if
    await this.redis.set(
      `blacklist:${prevTokenId}`,
      '1',
      'ex',
      prevTokenSecsTTL,
    );

    return this.makeRefreshToken(tp);
  }

  tokenPair(tp: TokenPayload): TokenPair {
    return {
      accessToken: this.makeAccessToken(tp),
      refreshToken: this.makeRefreshToken(tp),
    };
  }

  // invalidate;
}
