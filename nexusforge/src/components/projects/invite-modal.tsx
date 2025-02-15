// src/components/projects/invite-modal.tsx
import { Dialog } from '@/components/ui/dialog'

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

export function InviteModal({ isOpen, onClose, projectId }: InviteModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-medium mb-4">Invite Team Member</h2>
        {/* Add invite form here */}
      </div>
    </Dialog>
  )
}