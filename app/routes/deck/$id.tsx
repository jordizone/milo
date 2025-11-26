import { redirect, useLoaderData } from 'react-router'
import { createClient } from '~/utils/supabase/server'
import type { Route } from './+types/$id'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { EmptyCards } from '~/components/empty-cards'
import { DropdownMenuDemo } from '~/components/dropdown-menu-demo'

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
    <>
      <header className="fixed top-0 flex h-16 w-full items-center border-b border-gray-200 p-4">
        <div className="flex items-center">
          <SidebarTrigger />
          <h1 className="ml-4 text-lg">{deck.name}</h1>
        </div>
      </header>
      <main className="flex h-screen w-full flex-col p-4 pt-20">
        <div>
          {flashcards.length === 0 ? (
            <EmptyCards />
          ) : (
            <div className="grid gap-4">{/* TODO: Render flashcards */}</div>
          )}
        </div>
      </main>
    </>
    // <div className="mt-4 flex h-screen w-full flex-col gap-4 p-4 md:mt-20">
    //   <div className="mb-4 flex items-center justify-between">
    //     <h1 className="text-4xl font-black">{deck.name}</h1>
    //   </div>

    //   {deck.description && <p className="text-gray-600">{deck.description}</p>}

    // </div>
  )
}
