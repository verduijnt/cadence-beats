import { NextResponse } from 'next/server'
import {
  calculateAverageCadence,
  getStravaActivities,
  getStravaTokens,
} from '@/app/actions'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    console.log(code)
    const tokens = await getStravaTokens(code)
    // console.log(tokens)

    const activities = await getStravaActivities(tokens.access_token, 30)
    // console.log(activities)

    const averageCadence = calculateAverageCadence(activities)
    // console.log(averageCadence)
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/dashboard`)
}
