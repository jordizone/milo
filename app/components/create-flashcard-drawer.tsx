import { Drawer, DrawerContent, DrawerFooter } from '~/components/ui/drawer'
import { CreateFlashcardForm } from './create-flashcard-form'

interface CreateFlashcardDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deckId: string
}

export function CreateFlashcardDrawer({
  open,
  onOpenChange,
  deckId,
}: CreateFlashcardDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerFooter>
          <CreateFlashcardForm deckId={deckId} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
