import { Outlet } from 'react-router'
import { AppSidebar } from '~/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { createClient } from '~/utils/supabase/server'
import { redirect, useLoaderData } from 'react-router'
import type { Route } from './+types/_authenticated'

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch user's decks
  const { DeckService } = await import('~/utils/database')
  const deckService = new DeckService(supabase)
  const decks = await deckService.getDecks()

  return { user, decks }
}

export default function AuthenticatedLayout() {
  const { user, decks } = useLoaderData()

  return (
    <SidebarProvider>
      <AppSidebar user={user} decks={decks} />
      <main className="flex min-h-screen w-full flex-col">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
