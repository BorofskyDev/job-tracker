'use client'

import DocumentManagerModal from './DocumentManagerModal'
import ModalButton from '@/components/ui/buttons/ModalButton'

export default function ResumeManager() {
  return (
    <ModalButton
    className='bg-blue-100 hover:bg-purple-100'
      buttonLabel='Manage Resumes'
      modalContent={(close) => (
        <DocumentManagerModal
          onClose={close}
          docTypeLabel='Resume'
          collectionName='resumes'
          storageFolder='resumesFiles/'
        />
      )}
    />
  )
}
