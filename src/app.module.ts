import {Module} from '@nestjs/common'
import {SpotifyModule} from './spotify/spotify.module'
import {ConfigModule} from '@nestjs/config'
import {CacheModule} from '@nestjs/cache-manager'

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    SpotifyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
