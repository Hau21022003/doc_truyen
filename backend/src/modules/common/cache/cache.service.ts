import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { type Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set(key: string, value: any, ttl = 60) {
    return this.cache.set(key, value, ttl);
  }

  async del(key: string) {
    return this.cache.del(key);
  }

  // helper
  buildKey(prefix: string, params?: any) {
    return params ? `${prefix}:${JSON.stringify(params)}` : prefix;
  }

  /**
   * Cache-aside helper: trả về cache nếu có, không thì gọi fn() rồi cache kết quả.
   *
   * Sử dụng:
   *   return this.cacheService.withCache(
   *     CacheKey.one('tags', id),
   *     () => this.tagRepository.findOne({ where: { id } }),
   *   );
   */
  async getOrSet<T>(
    key: string,
    handler: () => Promise<T>,
    ttl = 300_000, // ms
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) {
      this.logger.debug(`Cache HIT [${key}]`);
      return cached;
    }

    this.logger.debug(`Cache MISS [${key}]`);

    const data = await handler();

    if (data) {
      await this.set(key, data, ttl);
    }

    return data;
  }

  /**
   * 🔥 Delete keys by pattern (Redis only)
   */
  async deleteByPattern(pattern: string) {
    const stores: any[] = (this.cache as any).stores;

    if (!stores?.length) {
      this.logger.warn('No cache stores found');
      return;
    }

    for (const store of stores) {
      // Keyv wraps the actual store
      const innerStore = store.store ?? store;

      // Lấy Redis client từ nhiều dạng package khác nhau
      const client =
        innerStore.client || // cache-manager-redis-yet / ioredis-yet
        innerStore.getClient?.() || // cache-manager-redis-store (cũ)
        store.client ||
        store.getClient?.();

      if (!client) {
        this.logger.warn(
          `Store "${store.constructor?.name}" không phải Redis → skip`,
        );
        continue;
      }

      this.logger.debug(`Scanning pattern: ${pattern}`);

      // let cursor = '0';

      // do {
      //   const result = await client.scan(
      //     cursor,
      //     'MATCH',
      //     pattern,
      //     'COUNT',
      //     100,
      //   );

      //   let nextCursor: string;
      //   let keys: string[];

      //   if (Array.isArray(result)) {
      //     // ioredis: [cursor, keys]
      //     [nextCursor, keys] = result;
      //   } else if (result && typeof result === 'object') {
      //     // node-redis: { cursor, keys }
      //     nextCursor = result.cursor;
      //     keys = result.keys;
      //   } else {
      //     this.logger.error('scan result format không xác định:', result);
      //     break;
      //   }

      //   cursor = nextCursor; // ✅ giữ nguyên string

      //   if (keys?.length > 0) {
      //     await client.del(...keys); // ⚠️ quan trọng
      //     this.logger.debug(`Deleted ${keys.length} keys`);
      //   }
      // } while (cursor !== '0');
      // let cursor = 0;

      // do {
      //   const result = await client.scan(
      //     cursor,
      //     'MATCH',
      //     pattern,
      //     'COUNT',
      //     100,
      //   );
      //   let nextCursor: number;
      //   let keys: string[];
      //   if (Array.isArray(result)) {
      //     // ioredis: [cursor, keys]
      //     [nextCursor, keys] = result;
      //   } else if (result && typeof result === 'object') {
      //     // node-redis: { cursor, keys }
      //     nextCursor = result.cursor;
      //     keys = result.keys;
      //   } else {
      //     this.logger.error('scan result format không xác định:', result);
      //     break;
      //   }

      //   cursor = Number(nextCursor);
      //   if (keys?.length > 0) {
      //     await client.del(keys); // ioredis chấp nhận cả array lẫn spread
      //     this.logger.debug(`Deleted ${keys.length} keys`);
      //   }
      // } while (cursor !== 0);
      let cursor = '0';

      do {
        const result = await client.scan(cursor, {
          MATCH: pattern,
          COUNT: 100,
        });

        const nextCursor = result.cursor;
        const keys = result.keys;

        cursor = nextCursor;

        if (keys?.length) {
          await client.del(keys); // node-redis chấp nhận array ✅
        }
      } while (cursor !== '0');
    }
  }
}
