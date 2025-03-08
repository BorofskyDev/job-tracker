'use client'

import { FormEvent, useState } from 'react'

interface DocumentCreationModalProps {
  onClose: () => void
  onUpload: (file: File, title: string) => Promise<void>
  docTypeLabel: string // e.g. "Resume" or "Cover Letter"
}

export default function DocumentCreationModal({
  onClose,
  onUpload,
  docTypeLabel,
}: DocumentCreationModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!file || !title.trim()) return

    try {
      await onUpload(file, title.trim())
      onClose()
    } catch (err) {
      console.error('Error uploading document:', err)
    }
  }

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Add {docTypeLabel}</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block font-medium mb-1'>{docTypeLabel} Title</label>
          <input
            className='border py-2 px-4 rounded-2xl bg-sky-100 focus:bg-sky-200'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`e.g. "Frontend Resume"`}
          />
        </div>

        <div>
          <label className='block font-medium mb-1'>Select File</label>
          <input
          className='border py-2 px-4 rounded-2xl cursor-pointer bg-sky-100 focus:bg-sky-200'
            type='file'
            accept='.pdf,.doc,.docx'
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0])
              }
            }}
          />
        </div>

        <div className='text-right'>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-800 cursor-pointer text-blue-50 rounded-2xl shadow-md transition-all duration-200 hover:bg-blue-950 hover:shadow-xl'
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  )
}
