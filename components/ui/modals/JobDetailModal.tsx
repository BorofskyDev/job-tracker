'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  DocumentData,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

import Modal from '@/components/ui/modals/Modal'
import InterviewCreatorModal from '@/components/ui/modals/InterviewCreatorModal'

interface Job {
  id: string
  companyName?: string
  jobTitle?: string
  appliedDate?: Timestamp
  outcome?: string
  notes?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  jobPostingUrl?: string
  priority?: string
  autoFollowUp?: boolean
  createdAt?: Timestamp
}

interface Interview {
  id: string
  jobId: string
  userId: string
  interviewDateTime?: Timestamp
  interviewers?: string
  contactInfo?: string
  notes?: string
  createdAt?: Timestamp
}

interface JobDetailsModalProps {
  job: Job
  onClose: () => void
}

export default function JobDetailsModal({
  job,
  onClose,
}: JobDetailsModalProps) {
  const { currentUser } = useAuth()

  // Local state for interviews
  const [interviews, setInterviews] = useState<Interview[]>([])

  // For showing the "Add Interview" modal
  const [showInterviewModal, setShowInterviewModal] = useState(false)

  useEffect(() => {
    if (!job?.id || !currentUser) return

    // Load all interviews for this job, sorted by interviewDateTime ascending
    const q = query(
      collection(db, 'interviews'),
      where('jobId', '==', job.id),
      where('userId', '==', currentUser.uid),
      orderBy('interviewDateTime', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData
        return {
          id: doc.id,
          ...data,
        } as Interview
      })
      // Real-time update from Firestore
      setInterviews(docs)
    })

    return () => unsubscribe()
  }, [job?.id, currentUser])

  // Format timestamps
  const appliedDateFormatted = job.appliedDate
    ? job.appliedDate.toDate().toLocaleDateString()
    : ''
  const createdAtFormatted = job.createdAt
    ? job.createdAt.toDate().toLocaleString()
    : ''

  // This function gets called right after we create the interview,
  // so we can add it to local state without waiting for Firestore snapshot.
  function handleInterviewSuccess(localInterview: {
    interviewDateTime: Date
    interviewers?: string
    contactInfo?: string
    notes?: string
  }) {
    // Construct a pseudo interview object
    const tempId = 'temp-' + Date.now().toString()

    const newInterview: Interview = {
      id: tempId, // local-only ID
      jobId: job.id,
      userId: currentUser?.uid || '',
      // We'll store a local date; Firestore would store a Timestamp
      interviewDateTime: {
        toDate: () => localInterview.interviewDateTime,
      } as Timestamp,
      interviewers: localInterview.interviewers,
      contactInfo: localInterview.contactInfo,
      notes: localInterview.notes,
      createdAt: { toDate: () => new Date() } as Timestamp, // or you could omit
    }

    setInterviews((prev) => [...prev, newInterview])
  }

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Job Details</h2>
      {/* Display job info... */}
      <div className='space-y-2'>
        <p>
          <strong>Company Name:</strong> {job.companyName || ''}
        </p>
        <p>
          <strong>Job Title:</strong> {job.jobTitle || ''}
        </p>
        <p>
          <strong>Applied Date:</strong> {appliedDateFormatted}
        </p>
        <p>
          <strong>Outcome:</strong> {job.outcome || ''}
        </p>
        <p>
          <strong>Notes:</strong> {job.notes || ''}
        </p>
        <p>
          <strong>Contact Name:</strong> {job.contactName || ''}
        </p>
        <p>
          <strong>Contact Email:</strong> {job.contactEmail || ''}
        </p>
        <p>
          <strong>Contact Phone:</strong> {job.contactPhone || ''}
        </p>
        <p>
          <strong>Job Posting:</strong>{' '}
          {job.jobPostingUrl ? (
            <a
              href={job.jobPostingUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              View Posting
            </a>
          ) : (
            ''
          )}
        </p>
        <p>
          <strong>Priority:</strong> {job.priority || ''}
        </p>
        <p>
          <strong>Auto Follow-Up:</strong> {job.autoFollowUp ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Created At:</strong> {createdAtFormatted}
        </p>
      </div>

      {/* Interviews section */}
      <div className='mt-6'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-bold'>Interviews</h3>
          <button
            onClick={() => setShowInterviewModal(true)}
            className='px-4 py-2 bg-sky-700 text-white rounded transition-all duration-200 hover:bg-sky-600 cursor-pointer'
          >
            + Add Interview
          </button>
        </div>

        {/* List existing interviews */}
        {interviews.length === 0 ? (
          <p className='text-gray-600'>No interviews scheduled.</p>
        ) : (
          <ul className='mt-4 space-y-2'>
            {interviews.map((interview) => {
              const interviewDate = interview.interviewDateTime
                ? interview.interviewDateTime.toDate().toLocaleString()
                : ''
              return (
                <li key={interview.id} className='p-3 border rounded'>
                  <p className='text-sm text-gray-700'>
                    <strong>Date/Time:</strong> {interviewDate}
                  </p>
                  {interview.interviewers && (
                    <p className='text-sm text-gray-700'>
                      <strong>Interviewers:</strong> {interview.interviewers}
                    </p>
                  )}
                  {interview.contactInfo && (
                    <p className='text-sm text-gray-700'>
                      <strong>Contact Info:</strong> {interview.contactInfo}
                    </p>
                  )}
                  {interview.notes && (
                    <p className='text-sm text-gray-700'>
                      <strong>Notes:</strong> {interview.notes}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Buttons */}
      <div className='mt-6 text-right'>
        <button
          onClick={onClose}
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          Close
        </button>
      </div>

      {/* Add Interview Modal */}
      {showInterviewModal && (
        <Modal onClose={() => setShowInterviewModal(false)}>
          <InterviewCreatorModal
            jobId={job.id}
            onClose={() => setShowInterviewModal(false)}
            onCreateInterviewSuccess={handleInterviewSuccess}
          />
        </Modal>
      )}
    </div>
  )
}
