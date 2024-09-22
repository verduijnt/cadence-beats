interface SpotifyArtist {
  name: string
}

export interface SpotifyTrack {
  name: string
  artists: SpotifyArtist[]
  duration_ms: number
  uri: string
}

export interface SpotifyPlaylist {
  id: string
  external_urls: {
    spotify: string
  }
  name: string
}

export interface SpotifyError {
  status: number
  message: string
}
