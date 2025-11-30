import { redirect } from 'react-router'
import { createClient } from '~/utils/supabase/server'
import type { Route } from './+types/home'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { Button } from '~/components/ui/button'
import { CreateDeckDrawer } from '~/components/create-deck-drawer'
import { useState } from 'react'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Milo' },
    { name: 'description', content: 'A flashcard app' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false)

  return (
    <>
      <header className="flex h-16 w-full items-center justify-between border-b-2 border-dashed border-gray-200 p-4">
        <div className="flex items-center">
          <SidebarTrigger />
        </div>
        <div>
          <Button
            className="bg-sky-500 font-mono"
            onClick={() => setCreateDrawerOpen(true)}
          >
            Create Deck
          </Button>
        </div>
      </header>
      <CreateDeckDrawer
        open={createDrawerOpen}
        onOpenChange={setCreateDrawerOpen}
      />
    </>
  )
}
