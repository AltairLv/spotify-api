import {Injectable, OnModuleDestroy} from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redisClient: Redis
  constructor() {
    this.redisClient = new Redis(process.env.REDIS_URI)
  }
  onModuleDestroy() {
    this.redisClient.disconnect()
  }
  async setValue(key: string, value: string, expirationTime: number): Promise<void> {
    await this.redisClient.set(key, value, 'EX', expirationTime)
  }

  getValue(key: string): Promise<string | null> {
    return this.redisClient.get(key)
  }
}
