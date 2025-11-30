import { redirect, useLoaderData } from 'react-router'
import { EmptyCards } from '~/components/empty-cards'
import { createClient } from '~/utils/supabase/server'
import type { Route } from './+types/$id'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { Button } from '~/components/ui/button'
import { DeleteDeckDrawer } from '~/components/delete-deck-drawer'
import { CreateFlashcardDrawer } from '~/components/create-flashcard-drawer'
import { FlashcardList } from '~/components/flashcard-list'
import { useState } from 'react'
import { CardService } from '~/utils/database'

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data?.deck?.name ? `${data.deck.name} - Milo` : 'Deck - Milo' },
    { name: 'description', content: 'View and study your flashcards' },
  ]
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { supabase } = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is not logged in, redirect to login
  if (!user) {
    return redirect('/login')
  }

  const deckId = params.id

  if (!deckId) {
    return redirect('/')
  }

  // Fetch the deck details
  const { DeckService } = await import('~/utils/database')
  const deckService = new DeckService(supabase)

  // TODO: Add method to get single deck by ID
  // const deck = await deckService.getDeckById(deckId)

  // For now, fetch all decks and find the one we need
  const decks = await deckService.getDecks()
  const deck = decks.find((d) => d.id === deckId)

  if (!deck) {
    throw new Response('Deck not found', { status: 404 })
  }

  // TODO: Fetch flashcards for this deck
  const cardService = new CardService(supabase)
  const flashcards = await cardService.getCards(deckId)

  return { user, deck, flashcards }
}

export default function DeckDetail() {
  const { deck, flashcards } = useLoaderData<typeof loader>()
  const [deleteDeckDrawerOpen, setDeleteDeckDrawerOpen] = useState(false)
  const [createFlashcardDrawerOpen, setCreateFlashcardDrawerOpen] =
    useState(false)

  return (
    <>
      <header className="fixed top-0 z-10 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center">
          <SidebarTrigger />
          <h1 className="ml-4 font-mono text-lg">{deck.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setCreateFlashcardDrawerOpen(true)}
            className="bg-sky-500"
          >
            Add Card
          </Button>
          <Button
            onClick={() => setDeleteDeckDrawerOpen(true)}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      </header>
      <main className="flex h-screen w-full flex-col p-4 pt-20 font-mono">
        <div>
          {flashcards.length === 0 ? (
            <EmptyCards
              onCreateClick={() => setCreateFlashcardDrawerOpen(true)}
            />
          ) : (
            <FlashcardList flashcards={flashcards} />
          )}
        </div>
      </main>
      <DeleteDeckDrawer
        open={deleteDeckDrawerOpen}
        onOpenChange={setDeleteDeckDrawerOpen}
        deckId={deck.id}
      />
      <CreateFlashcardDrawer
        open={createFlashcardDrawerOpen}
        onOpenChange={setCreateFlashcardDrawerOpen}
        deckId={deck.id}
      />
    </>
    // <div className="mt-4 flex h-screen w-full flex-col gap-4 p-4 md:mt-20">
    //   <div className="mb-4 flex items-center justify-between">
    //     <h1 className="text-4xl font-black">{deck.name}</h1>
    //   </div>

    //   {deck.description && <p className="text-gray-600">{deck.description}</p>}

    // </div>
  )
}
