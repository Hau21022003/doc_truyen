import { AppConfigService } from '@/config/app-config.service';
import KeyvRedis from '@keyv/redis';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        stores: [
          new KeyvRedis(
            `redis://${configService.redisHost}:${configService.redisPort}`,
          ),
        ],
      }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
