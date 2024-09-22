'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'

export default function SignupConfirmed() {
  useEffect(() => {
    const signInUser = async () => {
      const hash = window.location.hash.substring(1) // Remove the leading '#'
      const params = new URLSearchParams(hash)

      const supabase = createClient()

      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (error) {
          console.error('Error setting session:', error)
        } else {
          // Redirect to the dashboard or logged-in area
          window.location.href = '/dashboard?confirmed'
        }
      }
    }

    signInUser()
  }, [])

  return (
    <div className='flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='flex flex-col items-center'>
          Confirming your account and signing in...
        </div>
      </div>
    </div>
  )
}
