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

export function EmptyCards() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <WalletCards />
        </EmptyMedia>
        <EmptyTitle>No Flashcards Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any flashcards yet. Get started by creating
          your first flashcard.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Create Flashcard</Button>
          <Button variant="outline">Import Flashcards</Button>
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  )
}
