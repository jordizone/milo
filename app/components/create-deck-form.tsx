import { useEffect, useRef } from 'react'
import { useFetcher } from 'react-router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from './ui/spinner'

export function CreateDeckForm() {
  const fetcher = useFetcher()
  const inputRef = useRef<HTMLInputElement>(null)

  // Clear the input and refocus after successful submission
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <fetcher.Form
      method="post"
      action="/create-desk"
      className="flex w-full items-center gap-2 font-mono hover:cursor-pointer"
      onClick={(e) => e.stopPropagation()}
    >
      <Input
        ref={inputRef}
        type="text"
        placeholder="Deck name"
        name="deckName"
        disabled={fetcher.state !== 'idle'}
        required
      />
      <Button
        className="bg-sky-500"
        type="submit"
        disabled={fetcher.state !== 'idle'}
      >
        {fetcher.state !== 'idle' ? <Spinner /> : 'Create'}
      </Button>
    </fetcher.Form>
  )
}
