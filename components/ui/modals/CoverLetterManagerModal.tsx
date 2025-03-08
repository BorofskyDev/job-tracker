
import DocumentManagerModal from './DocumentManagerModal'
import ModalButton from '@/components/ui/buttons/ModalButton'

export default function CoverLetterManager() {
  return (
    <ModalButton
    className='bg-teal-100 hover:bg-green-100'
      buttonLabel='Manage Cover Letters'
      modalContent={(close) => (
        <DocumentManagerModal
          onClose={close}
          docTypeLabel='Cover Letter'
          collectionName='coverLetters'
          storageFolder='coverLettersFiles/'
        />
      )}
    />
  )
}
