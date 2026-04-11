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

    if (!stores || stores.length === 0) {
      this.logger.warn('No cache stores found');
      return;
    }

    // tìm Redis store (thường là store đầu tiên)
    const redisStore = stores[0];

    const client = redisStore.getClient?.() || redisStore.client; // cache-manager-redis-store // fallback

    if (!client) {
      this.logger.warn('Redis client not found → skip deleteByPattern');
      return;
    }

    let cursor = '0';

    do {
      const [nextCursor, keys] = await client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );

      cursor = nextCursor;

      if (keys.length > 0) {
        await client.del(keys);
        this.logger.debug(`Deleted ${keys.length} keys`);
      }
    } while (cursor !== '0');
  }
}
