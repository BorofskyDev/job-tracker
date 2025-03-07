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

interface Job {
  id: string
  companyName?: string
  jobTitle?: string
  appliedDate?: Timestamp // Firestore stores timestamps
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

export default function JobList() {
  const { currentUser } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

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
        // Convert doc data into a Job object
        const data = doc.data() as DocumentData
        return {
          id: doc.id,
          ...data,
        } as Job
      })
      setJobs(docs)
      setLoading(false)
    })

    // Cleanup on unmount
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

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200 bg-white'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
              Company Name
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
              Job Title
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
              Applied Date
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
              Outcome
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
              Notes
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
              Contact Name
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
              Contact Email
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
              Contact Phone
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
              Job Posting
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
              Priority
            </th>
            <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
              Auto Follow-Up
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {jobs.map((job) => {
            // Convert Firestore Timestamp => human-readable date
            const appliedDateFormatted =
              job.appliedDate?.toDate().toLocaleDateString() ?? ''

            return (
              <tr key={job.id} className='hover:bg-gray-100'>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                  {job.companyName || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                  {job.jobTitle || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                  {appliedDateFormatted}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                  {job.outcome || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                  {job.notes || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                  {job.contactName || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                  {job.contactEmail || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                  {job.contactPhone || ''}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                  {job.jobPostingUrl ? (
                    <a
                      href={job.jobPostingUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
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
    </div>
  )
}
