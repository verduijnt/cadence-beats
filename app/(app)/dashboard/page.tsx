import ConnectWithStrava from '@/components/strava-connect-button'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

interface UserTokens {
  id: number
  user_id: string
  strava_access_token: string
  strava_refresh_token: string
}

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const { data: userTokens } = await supabase
    .from('user_tokens')
    .select()
    .limit(1)
    .returns<UserTokens[]>()
  const showConnectWithStrava =
    !userTokens?.[0]?.strava_access_token ||
    !userTokens?.[0]?.strava_refresh_token
  return (
    <div className='flex-1 w-full flex flex-col gap-12'>
      <div className='flex flex-col gap-2 items-start'>
        <h2 className='font-bold text-2xl mb-4'>Your user details</h2>
        <pre className='text-xs font-mono p-3 rounded border max-w-4xl max-h-32 overflow-auto'>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      {showConnectWithStrava && <ConnectWithStrava />}
    </div>
  )
}
