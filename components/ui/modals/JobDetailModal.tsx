'use client'

import { Timestamp, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import InterviewComponent from '@/components/layouts/form-components/InterviewComponent'
import {
  useEditableFields,
  EditableJob,
} from '@/lib/hooks/useEditableFields'

export interface JobWithTimestamps {
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
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  autoFollowUp?: boolean
  createdAt?: Timestamp
}

interface JobDetailsModalProps {
  job: JobWithTimestamps // full job with Timestamps
  onClose: () => void
}

export default function JobDetailsModal({
  job,
  onClose,
}: JobDetailsModalProps) {
  const { currentUser } = useAuth()

  // Convert your full "JobWithTimestamps" to "EditableJob" by omitting timestamp fields
  const editableJob: EditableJob = {
    id: job.id,
    companyName: job.companyName,
    jobTitle: job.jobTitle,
    outcome: job.outcome,
    notes: job.notes,
    contactName: job.contactName,
    contactEmail: job.contactEmail,
    contactPhone: job.contactPhone,
    jobPostingUrl: job.jobPostingUrl,
    priority: job.priority,
    autoFollowUp: job.autoFollowUp,
  }

  // A callback that updates the doc in Firestore
 async function updateEditableJob(updates: Partial<EditableJob>) {
   if (!currentUser) return

   try {
     // The Firestore doc reference for this job:
     const docRef = doc(db, 'jobs', job.id)

     // The actual update call:
     await updateDoc(docRef, updates)

     console.log('Successfully updated job in Firestore')
   } catch (err) {
     console.error('Error updating doc:', err)
   }
 }

  const { hasChanges, renderEditableField, handleSaveChanges } =
    useEditableFields(editableJob, updateEditableJob)

  // Format read-only date fields
  const appliedDateFormatted = job.appliedDate
    ? job.appliedDate.toDate().toLocaleDateString()
    : ''
  const createdAtFormatted = job.createdAt
    ? job.createdAt.toDate().toLocaleString()
    : ''

  return (
    <div className='flex flex-col gap-8 max-w-2xl'>
      <h2 className='text-xl font-bold'>Job Details</h2>

      {/* Render editable fields (no timestamps) */}
      <div className='flex flex-col gap-4 max-w-2xl'>
        {renderEditableField('companyName', 'Company Name')}
        {renderEditableField('jobTitle', 'Job Title')}

        <p className='flex items-center justify-between'>
          <strong className='flex items-center justify-between'>
            Applied Date:
          </strong>{' '}
          {appliedDateFormatted}
        </p>
        {renderEditableField('outcome', 'Outcome', false)}
        {renderEditableField('contactName', 'Contact Name')}
        {renderEditableField('contactEmail', 'Contact Email')}
        {renderEditableField('contactPhone', 'Contact Phone')}
        {renderEditableField('jobPostingUrl', 'Job Posting')}
        {renderEditableField('priority', 'Priority')}
        {renderEditableField('autoFollowUp', 'Auto Follow-Up')}
        {renderEditableField('notes', 'Notes', true)}
        <p className='flex items-center justify-between'>
          <strong>Created At:</strong> {createdAtFormatted}
        </p>
      </div>

      {hasChanges && (
        <div className='mt-4'>
          <button
            onClick={handleSaveChanges}
            className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Interviews, etc. */}
      <InterviewComponent jobId={job.id} />

      <div className='mt-4 text-right'>
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
