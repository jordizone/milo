interface Deck {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface DeskListProps {
  decks: Deck[]
}

export function DeskList({ decks }: DeskListProps) {
  return (
    <div className="flex flex-col gap-4">
      {decks.length === 0 ? (
        <div className="text-muted-foreground col-span-full text-center">
          No decks yet. Create your first deck to get started!
        </div>
      ) : (
        decks.map((deck) => (
          <div
            key={deck.id}
            className="bg-card hover:bg-accent rounded-lg border p-4 text-center transition-colors hover:cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{deck.name}</h2>
            {deck.description && (
              <p className="text-muted-foreground text-sm">
                {deck.description}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
