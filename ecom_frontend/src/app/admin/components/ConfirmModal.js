'use client'

import { useDispatch, useSelector } from 'react-redux'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { closeConfirmModal } from '@/app/store/confirmModal'

export default function ConfirmModal() {
  const dispatch = useDispatch()
  const { isOpen, title, description, onConfirm } = useSelector(state => state.confirmModal)

  const handleConfirm = async () => {
    if (onConfirm) onConfirm()
    dispatch(closeConfirmModal())
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeConfirmModal())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title || 'Are you sure?'}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => dispatch(closeConfirmModal())}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
