'use client'

import { Button } from './ui/button'
import { connectStrava } from '@/app/actions'

const handleConnectStrava = async () => {
  connectStrava()
}

export default function StravaConnectButton() {
  return <Button onClick={handleConnectStrava}>Connect Strava</Button>
}
