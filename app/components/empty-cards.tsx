import { ArrowUpRightIcon, WalletCards } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'

interface EmptyCardsProps {
  onCreateClick?: () => void
}

export function EmptyCards({ onCreateClick }: EmptyCardsProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <WalletCards />
        </EmptyMedia>
        <EmptyTitle>No Flashcards Yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any flashcards yet. Get started by creating your
          first flashcard.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={onCreateClick}>Create Flashcard</Button>
          <Button variant="outline">Import Flashcards</Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}
