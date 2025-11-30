import { redirect } from 'react-router'
import { createClient } from '~/utils/supabase/server'
import type { Route } from './+types/create-deck'

export async function action({ request }: Route.ActionArgs) {
  const { supabase } = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const formData = await request.formData()
  const deckName = formData.get('deckName') as string

  // Validate deck name
  if (!deckName || deckName.trim() === '') {
    return { error: 'Deck name is required' }
  }

  try {
    // Import DeckService
    const { DeckService } = await import('~/utils/database')
    const deckService = new DeckService(supabase)

    // Create the deck
    const newDeck = await deckService.createDeck(
      {
        name: deckName.trim(),
        description: null,
        is_public: false,
      },
      user.id,
    )

    // Return success data - React Router will automatically revalidate loaders
    return redirect(`/deck/${newDeck.id}`)
  } catch (error) {
    console.error('Error creating deck:', error)
    return { error: 'Failed to create deck' }
  }
}
