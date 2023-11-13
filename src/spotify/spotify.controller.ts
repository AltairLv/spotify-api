import {Controller, Get, UseInterceptors} from '@nestjs/common'
import {SpotifyService} from './spotify.service'
import {ISpotify} from './types/types'
import {CacheInterceptor} from '@nestjs/cache-manager'

@UseInterceptors(CacheInterceptor)
@Controller()
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get()
  getSpotify(): Promise<ISpotify | string> {
    return this.spotifyService.getSpotify()
  }
}
