import {Module} from '@nestjs/common'
import {SpotifyService} from './spotify.service'
import {SpotifyController} from './spotify.controller'
import {RedisModule} from '../redis/redis.module'

@Module({
  controllers: [SpotifyController],
  providers: [SpotifyService],
  imports: [RedisModule],
})
export class SpotifyModule {}
