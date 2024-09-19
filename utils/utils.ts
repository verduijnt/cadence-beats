import { redirect } from 'next/navigation'

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: 'error' | 'success',
  path: string,
  message: string
): never {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`)
}

export function formatTime(seconds: string | number) {
  const numericSeconds =
    typeof seconds === 'string' ? parseFloat(seconds) : seconds

  const hours = Math.floor(numericSeconds / 3600)
  const minutes = Math.floor((numericSeconds % 3600) / 60)
  const remainingSeconds = numericSeconds % 60

  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds).padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${formattedMinutes}:${formattedSeconds}`
  }
  return `${minutes}:${formattedSeconds}`
}

export function formatDistance(distance: string | number) {
  const numericDistance =
    typeof distance === 'string' ? parseFloat(distance) : distance

  const formattedDistance = numericDistance / 1000
  return formattedDistance.toFixed(2)
}
