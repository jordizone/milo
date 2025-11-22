import { redirect } from 'react-router'
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
import { Settings } from 'lucide-react'

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
    <div className="mt-20 flex h-screen w-full flex-col gap-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-4xl font-black">Desks</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{loaderData.user.email}</DropdownMenuLabel>
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
  )
}
