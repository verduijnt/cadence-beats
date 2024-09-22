import { signOutAction } from '@/app/actions'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/server'
import LoginButton from './login-button'
import Link from 'next/link'

export default async function AuthButton() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ? (
    <div className='flex items-center gap-4'>
      <Button
        asChild
        className='hover:bg-spotify hover:text-black bg-strava text-white'
      >
        <Link href='/dashboard'>Dashboard</Link>
      </Button>
      <form action={signOutAction}>
        <Button type='submit' variant={'outline'}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <LoginButton />
  )
}
