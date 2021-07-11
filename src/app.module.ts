import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensModule } from './tokens/tokens.module';
import { ConfigModule } from '@nestjs/config';
import { UsersGateway } from './users.gateway';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot(),
    TokensModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  exports: [],
  providers: [UsersGateway],
})
export class AppModule {}
