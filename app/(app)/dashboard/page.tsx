import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { UserTokens } from '@/interfaces/userTokens'
import ConnectWithStrava from '@/components/strava-connect-button'
import MyPlaylists from '@/components/my-playlists'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!user || !session) {
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
    <div className='flex flex-col gap-12'>
      {showConnectWithStrava && <ConnectWithStrava />}
      <MyPlaylists searchParams={searchParams} />
    </div>
  )
}
