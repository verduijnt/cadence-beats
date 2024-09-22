import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SVGProps } from 'react'

export default function ConfirmSignup() {
  return (
    <div className='flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='flex flex-col items-center'>
          <CircleCheckIcon className='text-green-500 h-12 w-12' />
          <h1 className='mt-6 text-center text-3xl font-extrabold text-primary'>
            Confirmation Email Sent
          </h1>
          <p className='mt-2 text-center text-sm text-muted-foreground'>
            We've sent a confirmation email to your email address. Please check
            your inbox to activate your account.
          </p>
        </div>
        <div className='flex justify-center'>
          <Button asChild>
            <Link href='/' prefetch={false}>
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function CircleCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='10' />
      <path d='m9 12 2 2 4-4' />
    </svg>
  )
}
