import {Module} from '@nestjs/common'
import {SpotifyModule} from './spotify/spotify.module'
import {ConfigModule} from '@nestjs/config'
import {CacheModule} from '@nestjs/cache-manager'
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    SpotifyModule,
    RedisModule,
  ],
  controllers: [],
  providers: [RedisService],
})
export class AppModule {}
