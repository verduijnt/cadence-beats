'use client'

import { Button } from './ui/button'

export default function TestSpotify({ accessToken }: { accessToken: string }) {
  const testSpotify = async () => {
    if (accessToken) {
    }
  }

  return <Button onClick={testSpotify}>Test Spotify</Button>
}
