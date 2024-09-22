import { createClient } from '@/utils/supabase/server'
import { ExternalLinkIcon, PlusCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@radix-ui/react-hover-card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Badge } from './ui/badge'

export default async function MyPlaylists({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()
  const newPlaylist = searchParams && searchParams['playlist-created']
  const { data } = await supabase
    .from('user_playlists')
    .select()
    .order('id', { ascending: false })

  return (
    <Card>
      <CardHeader>
        <CardTitle>My playlists</CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length === 0 && (
          <div>It's empty here. Let's create your first playlist!</div>
        )}
        {data && data.length > 0 && (
          <Table className='text-xl'>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data!.map((playlist, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <span className='mr-2'>{playlist.playlist_name}</span>
                      {newPlaylist &&
                        playlist.id.toString() === newPlaylist && (
                          <Badge className='bg-strava'>NEW</Badge>
                        )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={playlist.playlist_url}
                        target='_blank'
                        className='flex gap-2'
                      >
                        <span>Open in Spotify</span>
                        <ExternalLinkIcon />
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className='flex justify-center'>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Link href='/dashboard/new-playlist'>
              <PlusCircleIcon className='text-spotify' size={64} />
            </Link>
          </HoverCardTrigger>
          <HoverCardContent>Create new playlist</HoverCardContent>
        </HoverCard>
      </CardFooter>
    </Card>
  )
}
