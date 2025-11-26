import type { User } from '@supabase/supabase-js'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'
import type { Deck } from '~/types/database'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { ChevronUp, Plus } from 'lucide-react'
import LogoutForm from './logout-form'
import { CreateDeckForm } from './create-deck-form'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { DeskList } from './desk-list'

interface AppSidebarProps {
  user: User
  decks: Deck[]
}

export function AppSidebar({ user, decks }: AppSidebarProps) {
  return (
    <Sidebar className="border-r-2 border-dashed">
      <SidebarHeader className="flex h-16 justify-center border-b border-gray-200">
        <div className="flex items-baseline justify-between">
          <h1 className="text-lg font-bold">Milo</h1>
          <span className="text-xs text-gray-400">v1.0.0</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="hover:cursor-pointer">
                <Plus className="h-6 w-6" />
                New Deck
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              className="z-10 mt-2 w-80 rounded-md border bg-white p-4"
            >
              <div className="">
                <CreateDeckForm />
              </div>
            </PopoverContent>
          </Popover>
        </SidebarGroup>
        <SidebarGroup>
          <DeskList decks={decks} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton variant="outline" className="border">
                  {user.email}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[271px] md:w-[239px]"
              >
                <DropdownMenuItem className="p-0">
                  <LogoutForm />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
