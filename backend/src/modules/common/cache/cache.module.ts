import { AppConfigService } from '@/config/app-config.service';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
// import { redisStore } from 'cache-manager-redis-store';
import * as redisStore from 'cache-manager-ioredis-yet';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      inject: [AppConfigService],
      // useFactory: async (config: AppConfigService) => {
      //   const redisHost = config.redisHost;

      //   if (redisHost) {
      //     // ── Redis store ─────────────────────────────────────────────────
      //     return {
      //       store: await redisStore({
      //         host: redisHost,
      //         port: config.redisPort,
      //         // password: config.get<string>('REDIS_PASSWORD'),
      //         // db: config.get<number>('REDIS_DB', 0),
      //         // TTL mặc định: 5 phút. Override per-call qua options.ttl.
      //         // ttl: config.get<number>('CACHE_TTL', 300),
      //         ttl: config.redisTTL,
      //       }),
      //     };
      //   }

      //   // ── In-memory store (dev / test) ──────────────────────────────────
      //   return {
      //     ttl: config.redisTTL,
      //     max: 500, // tối đa 500 entry trong memory
      //   };
      // },
      // useFactory: async (config: AppConfigService) => {
      //   const store = await redisStore({
      //     host: config.redisHost,
      //     port: config.redisPort,
      //     ttl: config.redisTTL,
      //   });

      //   const client = (store as any).getClient?.() || (store as any).client;

      //   console.log('REDIS HOST:', config.redisHost);
      //   console.log('REDIS PORT:', config.redisPort);
      //   console.log('HAS CLIENT:', !!client);

      //   return { store };
      // },
      useFactory: async (config: AppConfigService) => {
        return {
          store: redisStore,
          host: config.redisHost,
          port: config.redisPort,
          ttl: config.redisTTL,
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
