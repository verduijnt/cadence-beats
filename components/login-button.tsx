'use client'

import { Button } from './ui/button'
import { FaSpotify } from 'react-icons/fa6'
import { createClient } from '@/utils/supabase/client'

const handleSpotifyLogin = async () => {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      scopes:
        'user-read-private user-read-email playlist-modify-public playlist-modify-private',
      redirectTo: 'http://localhost:3000/auth/callback?next=/dashboard', // Redirect after login
    },
  })
  if (error) {
    console.error('Error logging in with Spotify:', error.message)
  }
}

export default function LoginButton() {
  return (
    <Button size='lg' onClick={handleSpotifyLogin} className='text-md'>
      <FaSpotify className='mr-2 text-spotify h-[32px] w-[32px]' />
      Sign in with Spotify
    </Button>
  )
}
