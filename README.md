# Spotify API: Get Recent / Current song

This project simplifies the process of getting information about the current or recently played song
( Title, Album, Artists, Album Cover ... ) on Spotify by managing access tokens, refreshing the token when necessary¹.
A database such as Redis is used to efficiently store and retrieve access tokens. All done through Spotify's API.

1. Access Tokens last 1 hour.

_(Redis was a personal choice, I do generally recommend a normal Database)_

## ☑️ To-do

- [x] Fix multiple Redis instances.
- [ ] Implement Cache Manager ?
- [ ] Add Unit Testing
- [ ] Add End-to-end Testing

## ✨ Getting Started

```bash
  git clone https://github.com/altairlv/spotify-api.git
  cd spotify-api
  pnpm install
```

- Set up your .env, e.g in .env.example

```bash
  pnpm run start:dev
```

- Runs on port 3024 : http://localhost:3024

## 📜 Data Structure

```http
  GET /
```

### Returned data

| Key             | Type            | Description                |
| :-------------- | :-------------- | :------------------------- |
| `isPlaying`     | `boolean`       | Defines if song is playing |
| `playedAt`      | `string` `null` | Last time played date      |
| `title`         | `string`        | Title of the song          |
| `artist`        | `string`        | Artist(s) name(s)          |
| `album`         | `string`        | Album's name               |
| `albumImageUrl` | `string`        | URL of Album's cover       |
| `songUrl`       | `string`        | URL of the song            |

Example :

```json
{
  "isPlaying": false,
  "playedAt": "2023-11-09T23:51:04.787Z",
  "title": "Moth To A Flame (with The Weeknd)",
  "artist": "Swedish House Mafia, The Weeknd",
  "album": "Moth To A Flame",
  "albumImageUrl": "https://i.scdn.co/image/ab67616d0000b273d82b40be0627a65b2d557847",
  "songUrl": "https://open.spotify.com/track/7kfOEMJBJwdCYqyJeEnNhr"
}
```

## Licence

[MIT](LICENSE)
