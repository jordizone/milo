import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer'
import { Button } from './ui/button'
import { CreateDeckForm } from './create-deck-form'

interface CreateDeckDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDeckDrawer({
  open,
  onOpenChange,
}: CreateDeckDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerFooter>
          <CreateDeckForm />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
