'use client'

import { useState } from 'react'
import Modal from '@/components/ui/modals/Modal'
import DocumentCreationModal from './DocumentCreationModal'
import { useDocuments } from '@/lib/hooks/useDocuments'
import { DocumentRecord } from '@/lib/hooks/useDocuments'

interface DocumentManagerModalProps {
  onClose: () => void
  docTypeLabel: string // e.g. "Resume" or "Cover Letter"
  collectionName: string // e.g. "resumes"
  storageFolder: string // e.g. "resumesFiles/"
}

export default function DocumentManagerModal({
  docTypeLabel,
  collectionName,
  storageFolder,
}: DocumentManagerModalProps) {
  const { documents, uploadDocument, getDownloadUrl } = useDocuments(
    collectionName,
    storageFolder
  )
  const [showCreationModal, setShowCreationModal] = useState(false)

  async function handleDownload(doc: DocumentRecord) {
    try {
      const url = await getDownloadUrl(doc.id)
      // Force a download, or open in a new tab:
      window.open(url, '_blank')
    } catch (err) {
      console.error('Error downloading file:', err)
    }
  }

  return (
    <div className='flex flex-col gap-4 items-center'>
      <h2 className='text-2xl font-bold mb-4'>{docTypeLabel} Manager</h2>

      {/* List existing docs */}
      {documents.length === 0 ? (
        <p>No {docTypeLabel.toLowerCase()}s found.</p>
      ) : (
        <ul className='space-y-2'>
          {documents.map((doc) => (
            <li
              key={doc.id}
              className='border p-3 rounded flex items-center gap-8'
            >
              <h4 className='text-lg font-semibold'>{doc.title}</h4>
              <button
                onClick={() => handleDownload(doc)}
                className='px-4 py-1 bg-sky-600 text-blue-50 cursor-pointer rounded-2xl transition-all duration-200 hover:bg-sky-950'
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className='mt-4 text-right'>
        <button
          onClick={() => setShowCreationModal(true)}
          className='mr-4 px-4 py-2 bg-blue-800 text-blue-50 font-bold rounded-2xl shadow-md cursor-pointer transition-all duration-200 hover:bg-blue-950 hover:shadow-xl'
        >
          Add {docTypeLabel}
        </button>
        
      </div>

      {showCreationModal && (
        <Modal onClose={() => setShowCreationModal(false)}>
          <DocumentCreationModal
            onClose={() => setShowCreationModal(false)}
            onUpload={uploadDocument}
            docTypeLabel={docTypeLabel}
          />
        </Modal>
      )}
    </div>
  )
}
