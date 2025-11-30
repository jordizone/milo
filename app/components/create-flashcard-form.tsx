import { useEffect, useRef } from 'react'
import { useFetcher } from 'react-router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from './ui/spinner'
import { Textarea } from './ui/textarea'

interface CreateFlashcardFormProps {
  deckId: string
}

export function CreateFlashcardForm({ deckId }: CreateFlashcardFormProps) {
  const fetcher = useFetcher()
  const frontInputRef = useRef<HTMLInputElement>(null)

  // Clear the input and refocus after successful submission
  useEffect(() => {
    if (frontInputRef.current) {
      frontInputRef.current.focus()
    }
  }, [])

  return (
    <fetcher.Form
      method="post"
      action="/create-flashcard"
      className="flex w-full flex-col gap-4 font-mono"
      onClick={(e) => e.stopPropagation()}
    >
      <input type="hidden" name="deckId" value={deckId} />

      <div className="flex flex-col gap-2">
        <label htmlFor="front" className="text-sm font-medium">
          Front
        </label>
        <Input
          ref={frontInputRef}
          type="text"
          placeholder="Question or prompt"
          name="front"
          id="front"
          disabled={fetcher.state !== 'idle'}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="back" className="text-sm font-medium">
          Back
        </label>
        <Textarea
          placeholder="Answer or explanation"
          name="back"
          id="back"
          disabled={fetcher.state !== 'idle'}
          required
          rows={4}
        />
      </div>

      <Button
        className="bg-sky-500"
        type="submit"
        disabled={fetcher.state !== 'idle'}
      >
        {fetcher.state !== 'idle' ? <Spinner /> : 'Create Flashcard'}
      </Button>
    </fetcher.Form>
  )
}
