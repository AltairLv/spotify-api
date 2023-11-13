import {Test, TestingModule} from '@nestjs/testing'
import {SpotifyService} from './spotify.service'
import {CACHE_MANAGER} from '@nestjs/cache-manager'

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
}
describe('SpotifyService', () => {
  let spotifyService: SpotifyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyService, {provide: CACHE_MANAGER, useValue: mockCacheManager}],
    }).compile()

    spotifyService = module.get<SpotifyService>(SpotifyService)
  })

  it('should be defined', () => {
    expect(spotifyService).toBeDefined()
  })
})
