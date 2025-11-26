import { redirect } from 'react-router'
import { createClient } from '~/utils/supabase/server'
import type { Route } from './+types/home'
import { SidebarTrigger } from '~/components/ui/sidebar'

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

  if (!user) {
    return redirect('/login')
  }

  return { user }
}

export default function Home() {
  return (
    <>
      <header className="flex h-16 items-center border-b border-gray-200 p-4">
        <div className="flex items-center">
          <SidebarTrigger />
        </div>
      </header>
    </>
  )
}
