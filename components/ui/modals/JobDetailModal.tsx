// components/ui/modals/JobDetailsModal.tsx
'use client'

import { Timestamp } from 'firebase/firestore'

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

interface JobDetailsModalProps {
  job: Job
  onClose: () => void
}

export default function JobDetailsModal({
  job,
  onClose,
}: JobDetailsModalProps) {
  // Convert Timestamps to readable strings
  const appliedDateFormatted = job.appliedDate
    ? job.appliedDate.toDate().toLocaleDateString()
    : ''
  const createdAtFormatted = job.createdAt
    ? job.createdAt.toDate().toLocaleString()
    : ''

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Job Details</h2>
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

      <div className='mt-6 text-right'>
        <button
          onClick={onClose}
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          Close
        </button>
      </div>
    </div>
  )
}
