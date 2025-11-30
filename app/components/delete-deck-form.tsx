import { useFetcher } from 'react-router'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'

interface DeleteDeckFormProps {
  deckId: string
  children: React.ReactNode
}

export function DeleteDeckForm({ deckId, children }: DeleteDeckFormProps) {
  const fetcher = useFetcher()

  return (
    <fetcher.Form method="post" action="/delete-deck">
      <input type="hidden" name="deckId" value={deckId} />
      <Button
        variant="destructive"
        type="submit"
        disabled={fetcher.state !== 'idle'}
        className="w-full text-left"
      >
        {fetcher.state === 'idle' ? children : <Spinner />}
      </Button>
    </fetcher.Form>
  )
}
