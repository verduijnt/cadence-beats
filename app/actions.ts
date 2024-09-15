'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const signOutAction = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect('/')
}

export const connectStrava = async () => {
  const stravaClientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI
  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${stravaClientId}&redirect_uri=${redirectUri}&response_type=code&scope=activity:read_all`

  // Redirect user to Strava login
  return redirect(stravaAuthUrl)
}

export const getStravaTokens = async (code: string) => {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  })

  const data = await response.json()
  return data
}

export const getStravaActivities = async (
  accessToken: string,
  count: number
) => {
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?per_page=${count}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`Error: ${data.message}`)
  }

  return data
}

export const calculateAverageCadence = (activities: any): number => {
  console.log(activities[0])
  activities.forEach((activity: any) => {
    console.log(`${activity.average_cadence} - ${activity.name}`)
  })
  const filteredActivities = activities.filter(
    (activity: any) => !!activity.average_cadence
  )
  const totalCadence = filteredActivities.reduce(
    (acc: any, activity: any) => acc + activity.average_cadence,
    0
  )
  const average = totalCadence / filteredActivities.length
  console.log(average)
  return average
}
