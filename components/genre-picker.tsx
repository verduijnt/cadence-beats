'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { useEffect, useState } from 'react'
import { Check, XIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { spotifyGenres } from '@/utils/constants'

export function GenrePicker() {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  const handleSelect = (currentValue: string) => {
    setSelectedValues((prevSelected) =>
      prevSelected.includes(currentValue)
        ? prevSelected.filter((value) => value !== currentValue)
        : [...prevSelected, currentValue]
    )
  }

  useEffect(() => {
    if (selectedValues.length === 5) {
      setOpen(false)
      setDisabled(true)
      return
    }

    setDisabled(false)
  }, [selectedValues])

  return (
    <>
      <div className='flex items-start gap-4'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              disabled={disabled}
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className={
                disabled
                  ? 'w-[200px] justify-between !cursor-not-allowed !pointer-events-all'
                  : 'w-[200px] justify-between'
              }
            >
              Select genre...
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
            <Command>
              <CommandInput placeholder='Search genre...' className='h-9' />
              <CommandList>
                <CommandEmpty>No genres found.</CommandEmpty>
                <CommandGroup>
                  {spotifyGenres.map((genre, index) => (
                    <CommandItem
                      key={index}
                      value={genre}
                      onSelect={() => handleSelect(genre)}
                    >
                      {genre}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedValues.find((value) => value === genre)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className='w-[250px]'>
          <h3>Selected genres:</h3>
          <div className='space-y-2'>
            {selectedValues.map((currentValue, index) => (
              <div key={index}>
                <Badge variant='outline' className='w-[250px]'>
                  <span className='text-lg'>{currentValue}</span>
                  <Button
                    className='h-6 w-6 ml-auto'
                    variant='link'
                    size='icon'
                    onClick={() =>
                      setSelectedValues((prevSelected) =>
                        prevSelected.includes(currentValue)
                          ? prevSelected.filter(
                              (value) => value !== currentValue
                            )
                          : [...prevSelected, currentValue]
                      )
                    }
                  >
                    <XIcon className='h-6 w-6' />
                  </Button>
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
