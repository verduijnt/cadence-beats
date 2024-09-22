'use client'

import { Button } from './ui/button'
import { FaSpotify } from 'react-icons/fa6'
import { createClient } from '@/utils/supabase/client'

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000'

const handleSpotifyLogin = async () => {
  const supabase = createClient()

  console.log(defaultUrl)

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      scopes:
        'user-read-private user-read-email playlist-modify-public playlist-modify-private',
      redirectTo: `${defaultUrl}/auth/callback?next=/dashboard`, // Redirect after login
    },
  })
  if (error) {
    console.error('Error logging in with Spotify:', error.message)
  }
}

export default function LoginButton() {
  return (
    <Button onClick={handleSpotifyLogin} className='text-md'>
      <FaSpotify className='mr-2 text-spotify h-[28px] w-[28px]' />
      Sign in with Spotify
    </Button>
  )
}
