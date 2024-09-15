import { signOutAction } from '@/app/actions'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/server'
import LoginButton from './login-button'

export default async function AuthButton() {
  const {
    data: { user },
  } = await createClient().auth.getUser()

  let displayName = ''
  if (!!user) {
    displayName = user.user_metadata.full_name ?? user.email
  }

  return user ? (
    <div className='flex items-center gap-4'>
      Hey {displayName}!
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
