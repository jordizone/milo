import { redirect, useLoaderData } from 'react-router'
import type { Route } from './+types/home'
import { createClient } from '~/utils/supabase/server'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Plus, Settings } from 'lucide-react'
import { DeskList } from '~/components/desk-list'
import { CreateDeckForm } from '~/components/create-deck-form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'

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

  // Fetch user's decks
  const { DeckService } = await import('~/utils/database')
  const deckService = new DeckService(supabase)
  const decks = await deckService.getDecks()

  return { user, decks }
}

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
    await deckService.createDeck(
      {
        name: deckName.trim(),
        description: null,
        is_public: false,
      },
      user.id,
    )

    // Redirect to refresh the page and show the new deck
    return redirect('/')
  } catch (error) {
    console.error('Error creating deck:', error)
    return { error: 'Failed to create deck' }
  }
}

export default function Home() {
  const { user, decks } = useLoaderData<typeof loader>()

  return (
    <div className="p-4">
      <p>Decks</p>
      {/* <div className="mb-4 flex items-center justify-between">
        <h1 className="text-4xl font-black">Decks</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="hover:cursor-pointer">
                <Plus className="h-6 w-6" />
                New Deck
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-10 mt-2 w-80 rounded-md border bg-white p-4">
              <div className="">
                <CreateDeckForm />
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hover:cursor-pointer">
                <Settings className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form
                    method="post"
                    action="/logout"
                    className="w-full hover:cursor-pointer"
                  >
                    <button type="submit" className="w-full text-left">
                      Log out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeskList decks={decks} /> */}
    </div>
  )
}
