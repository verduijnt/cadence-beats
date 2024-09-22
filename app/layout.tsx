import HeaderAuth from '@/components/header-auth'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from 'next-themes'
import Link from 'next/link'
import './globals.css'
import { FaHeart } from 'react-icons/fa6'
import { Toaster } from '@/components/ui/toaster'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Cadence Beats',
  description:
    'Create Spotify playlists based on the cadence of your Strava activities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={GeistSans.className} suppressHydrationWarning>
      <body className='bg-background text-foreground'>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          disableTransitionOnChange
        >
          <main className='min-h-screen flex flex-col items-center'>
            <div className='flex-1 w-full flex flex-col gap-20 items-center'>
              <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
                <div className='w-full container flex justify-between items-center p-3 px-5'>
                  <div className='flex items-center font-semibold text-3xl'>
                    <Link href={'/'} className='text-strava'>
                      Cadence <span className='text-spotify'>Beats</span>
                    </Link>
                  </div>
                  <div className='ml-auto items-center flex gap-2'>
                    <HeaderAuth />
                    <ThemeSwitcher />
                  </div>
                </div>
              </nav>
              <div className='flex flex-col container gap-20 p-5'>
                {children}
              </div>
              <footer className='w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-2 py-16'>
                Build with
                <FaHeart className='text-chart-1' />
                by Terry Verduijn
              </footer>
            </div>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
