export interface ICreate {
  access_token: string
}

export interface ISpotify {
  isPlaying: boolean
  playedAt: Date | null
  title: string
  artist: string
  album: string
  albumImageUrl: string
  songUrl: string
}
