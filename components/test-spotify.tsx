'use client'

import { Button } from './ui/button'

export default function TestSpotify({ accessToken }: { accessToken: string }) {
  const testSpotify = async () => {
    if (accessToken) {
      const meResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const meData = await meResponse.json()
      console.log(meData)

      const tracksResponse = await fetch(
        'https://api.spotify.com/v1/recommendations?seed_genres=drum-and-bass&min_tempo=168&max_tempo=172&limit=100',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      const tracksData = await tracksResponse.json()
      console.log(tracksData)

      console.log(tracksData.tracks.map((track: any) => track.uri))

      const createPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/users/${meData.id}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: 'Supabase Hackaton',
            description: 'A playlist created for the Supabase Hackaton',
            public: false,
          }),
        }
      )
      const playlistData = await createPlaylistResponse.json()
      console.log(playlistData)

      const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            uris: tracksData.tracks.map((track: any) => track.uri),
          }),
        }
      )
      const addTracksData = await addTracksResponse.json()
      console.log(addTracksData)
    }
  }

  return <Button onClick={testSpotify}>Test Spotify</Button>
}
