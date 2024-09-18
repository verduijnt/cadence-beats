'use server'

import { Activity } from '@/interfaces/activities'
import { UserTokens } from '@/interfaces/userTokens'
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

const refreshStravaToken = async (refreshToken: string) => {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  const data = await response.json()
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log(data)
  const { error } = await supabase
    .from('user_tokens')
    .update({
      strava_access_token: data.access_token,
      strava_refresh_token: data.refresh_token,
    })
    .eq('user_id', user!.id)

  if (error) {
    throw new Error(`Error: ${error.message}`)
  }

  return data
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
  console.log(data)
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('user is undefined')
  }

  const { error } = await supabase
    .from('user_tokens')
    .update({
      strava_access_token: data.access_token,
      strava_refresh_token: data.refresh_token,
    })
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`Error: ${error.message}`)
  }

  return data
}

export const getStravaActivities = async (
  count: number
): Promise<Activity[] | undefined> => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: userTokens } = await supabase
    .from('user_tokens')
    .select()
    .eq('user_id', user?.id)
    .limit(1)
    .returns<UserTokens[]>()

  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?per_page=${count}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userTokens?.[0].strava_access_token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    if (data.message === 'Authorization Error') {
      refreshStravaToken(userTokens?.[0].strava_refresh_token!)
      getStravaActivities(count)
      return
    }
    throw new Error(`Error: ${data.message}`)
  }

  return data as Activity[]
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

export const authenticateSpotify = async (): Promise<any> => {
  try {
    const response = await fetch('/api/spotify/authenticate', {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Failed to authenticate with Spotify')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getGenres = async (accessToken: string): Promise<any> => {
  try {
    const response = await fetch('/api/spotify/getGenres', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(
        'An error occurred while retrieving the genres, please try again'
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}
