import ConnectWithStrava from '@/components/strava-connect-button'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { GenrePicker } from '@/components/genre-picker'
import StravaActivities from '@/components/strava-activities'
import { UserTokens } from '@/interfaces/userTokens'

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
      {showConnectWithStrava && <ConnectWithStrava />}
      <GenrePicker />
      {!showConnectWithStrava && <StravaActivities />}
    </div>
  )
}
