'use server'

import { Activity } from '@/interfaces/activities'
import {
  SpotifyError,
  SpotifyPlaylist,
  SpotifyTrack,
} from '@/interfaces/spotify'
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

  const filteredActivities = data.filter(
    (activity: Activity) => !!activity.average_cadence
  )

  return filteredActivities as Activity[]
}

export const calculateAverageCadence = (activities: any): number => {
  const totalCadence = activities.reduce(
    (acc: any, activity: any) => acc + activity.average_cadence,
    0
  )
  const average = totalCadence / activities.length
  return average
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

export const getLoggedInSpotifyUser = async (accessToken: string) => {}

export const getSpotifyTrackRecommendations = async (
  accessToken: string,
  genres: string[],
  cadence: number
): Promise<SpotifyTrack[] | undefined> => {
  try {
    const params = new URLSearchParams({
      seed_genres: genres.join(','),
      min_tempo: (cadence - 2).toString(),
      max_tempo: (cadence + 2).toString(),
      limit: '25',
    })

    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/recommendations?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    const tracksData = await tracksResponse.json()

    return tracksData.tracks as SpotifyTrack[]
  } catch (error) {
    if ((error as SpotifyError).status === 401) {
    }
    console.error(error)
    return undefined
  }
}

export const createSpotifyPlaylist = async (
  accessToken: string,
  playlistName: string,
  playlistDescription: string,
  isPublic: boolean
): Promise<SpotifyPlaylist | undefined> => {
  try {
    const meResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const meData = await meResponse.json()

    if (meData) {
      const createPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/users/${meData.id}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: playlistName,
            description: playlistDescription,
            public: isPublic,
          }),
        }
      )
      const playlistData = await createPlaylistResponse.json()
      return playlistData
    }
    return undefined
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const addSpotifyTracksToPlaylist = async (
  accessToken: string,
  playlistId: string,
  trackUris: string[]
): Promise<string | undefined> => {
  try {
    const addTracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          uris: trackUris,
        }),
      }
    )
    const addTracksData = await addTracksResponse.json()
    return addTracksData.snapshot_id
  } catch (error) {
    console.error(error)
    return undefined
  }
}
