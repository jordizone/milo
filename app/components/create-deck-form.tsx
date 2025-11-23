import { useEffect, useRef } from 'react'
import { useFetcher } from 'react-router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export function CreateDeckForm() {
  const fetcher = useFetcher()
  const inputRef = useRef<HTMLInputElement>(null)

  // Clear the input and refocus after successful submission
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }, [fetcher.state, fetcher.data])

  return (
    <fetcher.Form
      method="post"
      action="/create-desk"
      className="flex w-full items-center gap-2 hover:cursor-pointer"
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
      <Button type="submit" disabled={fetcher.state !== 'idle'}>
        {fetcher.state !== 'idle' ? 'Creating...' : 'Create'}
      </Button>
    </fetcher.Form>
  )
}
