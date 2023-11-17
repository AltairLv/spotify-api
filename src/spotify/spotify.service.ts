import {Inject, Injectable} from '@nestjs/common'
import {Cache} from 'cache-manager'
import type {ICreate, ISpotify} from './types/types'
import {accessTokenSchema, playingSpotifySchema, recentSpotifySchema} from './zod/zod'
import {CACHE_MANAGER} from '@nestjs/cache-manager'
import {RedisService} from '../redis/redis.service'

@Injectable()
export class SpotifyService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly redisService: RedisService
  ) {}

  async create(): Promise<ICreate> {
    const client_id = process.env.SPOTIFY_CLIENT_ID
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET
    const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN

    try {
      const getCachedToken = await this.redisService.getValue('token')

      if (getCachedToken) {
        return JSON.parse(getCachedToken)
      }

      const responseNewToken = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
        }),
      })

      const responseJson = await responseNewToken.json()
      const validResponse = accessTokenSchema.parse(responseJson)

      const stringFormat = JSON.stringify(validResponse)
      await this.redisService.setValue('token', stringFormat, 3600)

      return {access_token: validResponse.access_token}
    } catch (err) {
      console.error(err)
    }
  }

  async findCurrent(access_token: string): Promise<ISpotify> {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      if (response.status === 204) {
        return null
      }
      const responseJson = await response.json()
      const validPlaying = playingSpotifySchema.parse(responseJson)

      const song = validPlaying.item

      const isPlaying = validPlaying.is_playing
      const playedAt = null
      const title = song.name
      const artist = song.artists.map((artist) => artist.name).join(', ')
      const album = song.album.name
      const albumImageUrl = song.album.images[0].url
      const songUrl = song.external_urls.spotify

      return {
        isPlaying,
        playedAt,
        title,
        artist,
        album,
        albumImageUrl,
        songUrl,
      }
    } catch (err) {
      console.error(err)
    }
  }

  async findRecent(access_token: string): Promise<ISpotify> {
    try {
      const date = Math.floor(Date.now())
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/recently-played?before=${date}&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      const responseJson = await response.json()
      const validRecent = recentSpotifySchema.parse(responseJson)

      const track = validRecent.items[0].track

      if (validRecent.items.length === 0) {
        return null
      }
      const isPlaying = false
      const playedAt = validRecent.items[0].played_at
      const title = track.name
      const artist = track.artists.map((artist) => artist.name).join(', ')
      const album = track.album.name
      const albumImageUrl = track.album.images[0].url
      const songUrl = track.external_urls.spotify

      return {
        isPlaying,
        playedAt,
        title,
        artist,
        album,
        albumImageUrl,
        songUrl,
      }
    } catch (err) {
      console.error(err)
    }
  }

  async getSpotify(): Promise<ISpotify | string> {
    try {
      const {access_token} = await this.create()
      const [recentMusic, currentMusic] = await Promise.all([
        this.findRecent(access_token),
        this.findCurrent(access_token),
      ])
      if (currentMusic?.isPlaying) {
        return currentMusic
      }
      return recentMusic
    } catch (err) {
      return 'An Error Occurred'
    }
  }
}
