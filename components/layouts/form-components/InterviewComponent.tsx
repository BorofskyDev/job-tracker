'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  DocumentData,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Modal from '@/components/ui/modals/Modal'
import InterviewCreatorModal from '@/components/ui/modals/InterviewCreatorModal'

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

interface InterviewComponentProps {
  jobId: string
}

export default function InterviewComponent({ jobId }: InterviewComponentProps) {
  const { currentUser } = useAuth()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [showInterviewModal, setShowInterviewModal] = useState(false)

  useEffect(() => {
    if (!jobId || !currentUser) return

    const q = query(
      collection(db, 'interviews'),
      where('jobId', '==', jobId),
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
      setInterviews(docs)
    })

    return () => unsubscribe()
  }, [jobId, currentUser])

  return (
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

      {showInterviewModal && (
        <Modal onClose={() => setShowInterviewModal(false)}>
          <InterviewCreatorModal
            jobId={jobId}
            onClose={() => setShowInterviewModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}
