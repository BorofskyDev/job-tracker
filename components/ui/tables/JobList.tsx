'use client'

import { useEffect, useState } from 'react'
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
import { useAuth } from '@/context/AuthContext'
import Modal from '@/components/ui/modals/Modal' // The generic modal
import JobDetailsModal from '@/components/ui/modals/JobDetailModal' // Our new job-details component

type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

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
  priority?: Priority
  autoFollowUp?: boolean
  createdAt?: Timestamp
}

function getRowBgColor(outcome?: string) {
  switch (outcome) {
    case 'Denied':
      return 'bg-rose-50'
    case 'Interview':
      return 'bg-emerald-50'
    case 'Hired':
      return 'bg-emerald-200'
    
    default:
      return 'bg-slate-50'
  }
}

function getRowWeight(outcome?: string) {
  switch (outcome) {
    case 'LOW':
      return 'font-light'
    case 'HIGH':
      return 'font-semibold'
    default: 
    return ''
  }
}

export default function JobList() {
  const { currentUser } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  // For showing the details modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    // Query jobs for the current user, ordered by createdAt desc
    const q = query(
      collection(db, 'jobs'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData
        return {
          id: doc.id,
          ...data,
        } as Job
      })
      setJobs(docs)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [currentUser])

  if (!currentUser) {
    return <p className='text-gray-600'>Please log in to see your jobs.</p>
  }

  if (loading) {
    return <p className='text-gray-600'>Loading jobs...</p>
  }

  if (jobs.length === 0) {
    return <p className='text-gray-600'>No jobs found.</p>
  }

  function handleRowClick(job: Job) {
    // Set selected job and open the modal
    setSelectedJob(job)
    setIsDetailsModalOpen(true)
  }

  function closeDetailsModal() {
    setSelectedJob(null)
    setIsDetailsModalOpen(false)
  }

  return (
    <div className='overflow-x-auto my-4 border rounded-2xl'>
      <table className='min-w-full divide-y divide-gray-200 bg-white'>
        <thead className='bg-blue-900'>
          <tr className='text-blue-50 border-b'>
            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
              Company Name
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
              Job Title
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
              Applied Date
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
              Outcome
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
              Contact Name
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
              Contact Email
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
              Contact Phone
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
              Job Posting
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
              Priority
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
              Auto Follow-Up
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-400'>
          {jobs.map((job) => {
            const appliedDateFormatted =
              job.appliedDate?.toDate().toLocaleDateString() ?? ''
            const rowBgColor = getRowBgColor(job.outcome)
            const rowWeight = getRowWeight(job.priority)
            return (
              <tr
                key={job.id}
                onClick={() => handleRowClick(job)}
                className={`transition-all duration-200 cursor-pointer hover:bg-sky-100 ${rowBgColor} ${rowWeight}`}
              >
                <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-950'>
                  {job.companyName || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-950'>
                  {job.jobTitle || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-950'>
                  {appliedDateFormatted}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-950'>
                  {job.outcome || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-950'>
                  {job.contactName || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-950'>
                  {job.contactEmail || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-950'>
                  {job.contactPhone || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-950'>
                  {job.jobPostingUrl ? (
                    <a
                      href={job.jobPostingUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                      onClick={(e) => e.stopPropagation()}
                    >
                      Link
                    </a>
                  ) : (
                    ''
                  )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                  {job.priority || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                  {job.autoFollowUp ? 'Yes' : 'No'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* If selectedJob is set, show the modal */}
      {isDetailsModalOpen && selectedJob && (
        <Modal onClose={closeDetailsModal}>
          <JobDetailsModal job={selectedJob} onClose={closeDetailsModal} />
        </Modal>
      )}
    </div>
  )
}
