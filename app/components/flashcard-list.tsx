import { Card, CardContent } from '~/components/ui/card'
import type { Card as FlashCard } from '~/types/database'

interface FlashcardListProps {
  flashcards: FlashCard[]
}

export function FlashcardList({ flashcards }: FlashcardListProps) {
  return (
    <div className="grid gap-4">
      {flashcards.map((card) => (
        <Card key={card.id} className="font-mono">
          <CardContent className="flex flex-col gap-4 py-1">
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground text-sm font-medium">
                Front
              </div>
              <div className="text-base">{card.front}</div>
            </div>
            <div className="bg-border h-px" />
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground text-sm font-medium">
                Back
              </div>
              <div className="text-base">{card.back}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
