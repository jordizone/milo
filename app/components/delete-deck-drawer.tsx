import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer'
import { Button } from './ui/button'
import { DeleteDeckForm } from './delete-deck-form'

interface DeleteDeckDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deckId: string
}

export function DeleteDeckDrawer({
  open,
  onOpenChange,
  deckId,
}: DeleteDeckDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DeleteDeckForm deckId={deckId}>Delete</DeleteDeckForm>
          <DrawerClose className="w-full">
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
