import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatasourcesModule } from 'src/datasources/datasources.module';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    DatasourcesModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { algorithm: 'HS256' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
