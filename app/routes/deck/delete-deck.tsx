import { redirect } from 'react-router'
import { createClient } from '~/utils/supabase/server'
import type { Route } from './+types/delete-deck'

export async function action({ request }: Route.ActionArgs) {
  const { supabase } = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const formData = await request.formData()
  const deckId = formData.get('deckId') as string

  // Validate deck ID
  if (!deckId || deckId.trim() === '') {
    return { error: 'Deck ID is required' }
  }

  try {
    // Import DeckService
    const { DeckService } = await import('~/utils/database')
    const deckService = new DeckService(supabase)

    // Verify the deck exists and belongs to the user
    const deck = await deckService.getDeck(deckId.trim())

    if (!deck) {
      return { error: 'Deck not found' }
    }

    if (deck.user_id !== user.id) {
      return { error: 'Unauthorized: You do not own this deck' }
    }

    // Delete the deck (will cascade delete all cards)
    await deckService.deleteDeck(deckId.trim())

    // Return success response - React Router will automatically revalidate loaders
    return redirect('/')
  } catch (error) {
    console.error('Error deleting deck:', error)
    return { error: 'Failed to delete deck' }
  }
}
