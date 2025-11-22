import { redirect } from 'react-router'
import type { Route } from './+types/home'
import { createClient } from '~/utils/supabase/server'
import { Button } from '~/components/ui/button'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Milo' },
    { name: 'description', content: 'A flashcard app' },
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is not logged in, redirect to login
  if (!user) {
    return redirect('/login')
  }

  return { user }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-rounded text-4xl font-extrabold tracking-tight">
        Milo
      </h1>
      <p className="text-gray-600">Welcome, {loaderData.user.email}!</p>
      <form method="post" action="/logout">
        <Button type="submit" variant="destructive">
          Logout
        </Button>
      </form>
    </div>
  )
}
