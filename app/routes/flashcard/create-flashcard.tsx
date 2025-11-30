import { redirect } from 'react-router'
import { createClient } from '~/utils/supabase/server'
import type { Route } from './+types/create-flashcard'

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
  const front = formData.get('front') as string
  const back = formData.get('back') as string

  if (!deckId || !front || !back) {
    return { error: 'Missing required fields' }
  }

  // Create the flashcard
  const { error } = await supabase.from('cards').insert({
    deck_id: deckId,
    user_id: user.id,
    front,
    back,
    repetitions: 0,
    interval: 0,
    easiness_factor: 2.5,
    next_review: new Date().toISOString(),
    history: [],
  })

  if (error) {
    console.error('Error creating flashcard:', error)
    return { error: 'Failed to create flashcard' }
  }

  return redirect(`/deck/${deckId}`)
}
