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
import { DeleteDeckForm } from './delete-deck-form'

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
          </SidebarMenuItem>
        ))
      )}
    </div>
  )
}
