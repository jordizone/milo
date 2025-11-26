import { Link } from 'react-router'
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from './ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { Button } from './ui/button'

interface Deck {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface DeskListProps {
  decks: Deck[]
}

export function DeskList({ decks }: DeskListProps) {
  return (
    <div className="flex flex-col">
      {decks.length === 0 ? (
        <div className="text-muted-foreground col-span-full text-center text-sm">
          Create your first deck to get started!
        </div>
      ) : (
        decks.map((deck) => (
          <SidebarMenuItem key={deck.id}>
            <SidebarMenuButton asChild>
              <Link to={`/deck/${deck.id}`} className="text-base">
                {deck.name}
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction className="hover:cursor-pointer">
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem className="text-red-600 hover:cursor-pointer hover:bg-red-200">
                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                  <form action={`/deck/delete-deck/${deck.id}`} method="post">
                    <button type="submit">
                      <span className="text-red-600">Delete</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))
      )}
    </div>
  )
}
