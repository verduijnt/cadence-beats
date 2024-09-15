'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaLaptop, FaRegMoon, FaRegSun } from 'react-icons/fa6'

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const ICON_SIZE = 20

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size={'sm'}>
          {theme === 'light' ? (
            <FaRegSun
              key='light'
              size={ICON_SIZE}
              className={'text-muted-foreground'}
            />
          ) : theme === 'dark' ? (
            <FaRegMoon
              key='dark'
              size={ICON_SIZE}
              className={'text-muted-foreground'}
            />
          ) : (
            <FaLaptop
              key='system'
              size={ICON_SIZE}
              className={'text-muted-foreground'}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-content' align='start'>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem className='flex gap-2' value='light'>
            <FaRegSun size={ICON_SIZE} className='text-muted-foreground' />{' '}
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className='flex gap-2' value='dark'>
            <FaRegMoon size={ICON_SIZE} className='text-muted-foreground' />{' '}
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className='flex gap-2' value='system'>
            <FaLaptop size={ICON_SIZE} className='text-muted-foreground' />{' '}
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ThemeSwitcher }
