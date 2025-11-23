import { redirect, useLoaderData } from 'react-router'
import type { Route } from './+types/decks.$id'
import { createClient } from '~/utils/supabase/server'

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
  // const flashcards = await flashcardService.getFlashcardsByDeckId(deckId)

  return { user, deck, flashcards: [] }
}

export default function DeckDetail() {
  const { deck, flashcards } = useLoaderData<typeof loader>()

  return (
    <div className="mt-4 flex h-screen w-full flex-col gap-4 p-4 md:mt-20">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-4xl font-black">{deck.name}</h1>
      </div>

      {deck.description && <p className="text-gray-600">{deck.description}</p>}

      <div className="mt-4">
        <h2 className="mb-4 text-2xl font-bold">Flashcards</h2>
        {flashcards.length === 0 ? (
          <p className="text-gray-500">
            No flashcards yet. Create your first one!
          </p>
        ) : (
          <div className="grid gap-4">{/* TODO: Render flashcards */}</div>
        )}
      </div>
    </div>
  )
}
