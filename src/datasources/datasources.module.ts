import { Module } from '@nestjs/common';
import redis from './providers/redis.provider';

@Module({
  providers: [{ provide: 'REDIS_CONNECTION', useValue: redis }],
  exports: ['REDIS_CONNECTION'],
})
export class DatasourcesModule {}
