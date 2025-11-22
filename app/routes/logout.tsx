import { redirect } from 'react-router'
import { createClient } from '~/utils/supabase/server'
import type { Route } from '../+types/root'

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createClient(request)

  await supabase.auth.signOut()

  return redirect('/login', {
    headers,
  })
}

export async function loader() {
  return redirect('/login')
}
