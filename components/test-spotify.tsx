'use client'

import { Button } from './ui/button'

export default function TestSpotify({ accessToken }: { accessToken: string }) {
  const testSpotify = async () => {
    if (accessToken) {
      const response = await fetch(
        'https://api.spotify.com/v1/recommendations/available-genre-seeds',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      const data = await response.json()
      console.log(data)
    }
  }

  return <Button onClick={testSpotify}>Test Spotify</Button>
}
