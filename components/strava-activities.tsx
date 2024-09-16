'use client'

import * as React from 'react'
import { getStravaActivities } from '@/app/actions'
import { useEffect, useState } from 'react'
import { Activity } from '@/interfaces/activities'

export default function StravaActivities() {
  const [isLoading, setIsLoading] = useState(true)
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      const latestActivities = await getStravaActivities('', 100)
      if (latestActivities) {
        setActivities(latestActivities)
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return (
    <>
      <div>
        {isLoading ? (
          <div>Loading recent activities...</div>
        ) : (
          <>
            <div>Activities</div>
            {activities.map((activity, index) => (
              <p key={index}>{activity.name}</p>
            ))}
          </>
        )}
      </div>
    </>
  )
}
