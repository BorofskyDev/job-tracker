'use client'

import { FormEvent, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useInterviews } from '@/lib/hooks/useInterview'

interface InterviewCreatorModalProps {
  jobId: string
  onClose: () => void
  /**
   * Optional callback for the parent to update local state
   * immediately after the interview is created.
   */
  onCreateInterviewSuccess?: (localInterview: {
    interviewDateTime: Date
    interviewers?: string
    contactInfo?: string
    notes?: string
  }) => void
}

export default function InterviewCreatorModal({
  jobId,
  onClose,
//   onCreateInterviewSuccess,
}: InterviewCreatorModalProps) {
  const { currentUser } = useAuth()
  const { createInterview } = useInterviews()

  // Required date/time
  const [dateTime, setDateTime] = useState('')

  // Optional fields
  const [interviewers, setInterviewers] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [notes, setNotes] = useState('')

  // Error handling
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!currentUser) {
      setErrorMessage('You must be logged in to add an interview.')
      return
    }
    if (!dateTime) {
      setErrorMessage('Interview date and time are required.')
      return
    }

    try {
      // 1) Convert dateTime string to a Date
      const parsedDateTime = new Date(dateTime)

      // 2) Create interview in Firestore
      await createInterview(currentUser, {
        jobId,
        userId: currentUser.uid, // reaffirm user ID (the hook enforces it anyway)
        interviewDateTime: parsedDateTime,
        interviewers,
        contactInfo,
        notes,
      })

      // 3) Optimistic update: call parent callback (if provided)
    //   onCreateInterviewSuccess?.({
    //     interviewDateTime: parsedDateTime,
    //     interviewers,
    //     contactInfo,
    //     notes,
    //   })

      // 4) Close modal
      onClose()
    } catch (error) {
      console.error('Error creating interview:', error)
      setErrorMessage('Failed to create interview. Please try again.')
    }
  }

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Add Interview</h2>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Date/Time */}
        <div>
          <label className='block font-medium mb-1'>
            Interview Date/Time <span className='text-red-500'>*</span>
          </label>
          <input
            type='datetime-local'
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className='border p-2 w-full'
            required
          />
        </div>

        {/* Interviewers */}
        <div>
          <label className='block font-medium mb-1'>Interviewers</label>
          <input
            type='text'
            value={interviewers}
            onChange={(e) => setInterviewers(e.target.value)}
            placeholder='e.g. Lisa Smith, John Doe'
            className='border p-2 w-full'
          />
        </div>

        {/* Contact Info */}
        <div>
          <label className='block font-medium mb-1'>Contact Info</label>
          <input
            type='text'
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder='Recruiter email or phone'
            className='border p-2 w-full'
          />
        </div>

        {/* Notes */}
        <div>
          <label className='block font-medium mb-1'>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className='border p-2 w-full'
            rows={3}
          />
        </div>

        <div className='text-right'>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Create Interview
          </button>
        </div>
      </form>
    </div>
  )
}
