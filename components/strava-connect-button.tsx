'use client'

import { FaStrava } from 'react-icons/fa6'
import { Button } from './ui/button'
import { connectStrava } from '@/app/actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

const handleConnectStrava = async () => {
  connectStrava()
}

function StravaConnectButton() {
  return (
    <Button onClick={handleConnectStrava}>
      <FaStrava className='mr-2 text-chart-1' />
      Connect Strava
    </Button>
  )
}

export default function ConnectWithStrava() {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect with Strava</DialogTitle>
          <DialogDescription>
            With Cadence Beats you can create Spotify playlists based on your
            latest activities in Strava. To get these activities, you need to
            connect to Strava.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <StravaConnectButton />
        </div>
      </DialogContent>
    </Dialog>
  )
}
