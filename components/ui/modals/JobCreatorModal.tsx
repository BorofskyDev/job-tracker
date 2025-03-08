'use client'

import { FormEvent, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useJobs, JobData, Priority } from '@/lib/hooks/useJobs'

interface JobCreatorModalProps {
  onClose: () => void
}

function parseLocalDate(dateStr: string): Date {
  // "2025-03-07" => [2025, 03, 07]
  const [year, month, day] = dateStr.split('-').map(Number)
  // Create a date for local time, optionally pick hour=12 to avoid time zone shifts
  return new Date(year, month - 1, day, 12, 0, 0)
}


export default function JobCreatorModal({ onClose }: JobCreatorModalProps) {
  const { currentUser } = useAuth()
  const { createJob } = useJobs()

  // Required fields
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  // Default `appliedDate` to today's date
  const [appliedDate, setAppliedDate] = useState(
    new Date().toISOString().slice(0, 10)
  )

  // Optional fields
  const [notes, setNotes] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [jobPostingUrl, setJobPostingUrl] = useState('')

  // Priority: default to "MEDIUM"
  const [priority, setPriority] = useState<Priority>('MEDIUM')

  // Boolean: should we follow up automatically?
  const [autoFollowUp, setAutoFollowUp] = useState(false)

  // Error message for form validation
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!currentUser) {
      setErrorMessage('You must be logged in to create a job.')
      return
    }

    // Simple validation
    if (!companyName.trim() || !jobTitle.trim()) {
      setErrorMessage('Company name and job title are required.')
      return
    }
     
    const date = appliedDate ? parseLocalDate(appliedDate) : new Date()
    try {
      // Construct the job data
      const jobData: JobData = {
        companyName,
        jobTitle,
        appliedDate: date,
        notes: notes || undefined,
        contactName: contactName || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        jobPostingUrl: jobPostingUrl || undefined,
        priority,
        autoFollowUp,
      }

      const docRef = await createJob(currentUser, jobData)
      console.log('New job doc created, ID:', docRef.id)

      // Close the modal on success
      onClose()
    } catch (err) {
      console.error('Error creating job:', err)
      setErrorMessage('Error creating job. Please try again.')
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <h2 className='text-2xl font-bold'>Create a New Job Entry</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
      <p className="text-sm flex items-center gap-4">
        
      <span className='text-2xl text-red-800'>*</span> = required
        </p>
        {/* Company Name */}
        <div className='flex gap-4 items-center'>
          <label className='font-medium'>
            Company Name<span className='text-2xl text-red-800'>*</span>:
          </label>
          <input
            className='my-4 py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
            type='text'
            value={companyName}
            required
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        {/* Job Title */}
        <div className='flex gap-4 items-center my-4'>
          <label className='font-medium'>
            Job Title<span className='text-2xl text-red-800'>*</span>:
          </label>
          <input
            className='py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
            type='text'
            value={jobTitle}
            required
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        {/* Applied Date */}
        <div className='flex gap-4 items-center my-4'>
          <label className='font-medium'>
            Applied Date<span className='text-2xl text-red-800'>*</span>:
          </label>
          <input
            className='py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
            type='date'
            value={appliedDate}
            required
            onChange={(e) => setAppliedDate(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className='my-4 flex gap-4 items-center'>
          <label className='font-medium'>Notes:</label>
          <textarea
            className='py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Contact Name */}
        <div className='my-4 flex gap-4 items-center'>
          <label className='font-medium'>Contact Name:</label>
          <input
            className='py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
            type='text'
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>

        {/* Contact Email */}
        <div className='my-4 flex gap-4 items-center'>
          <label className='font-medium'>Contact Email:</label>
          <input
            className='py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
            type='email'
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>

        {/* Contact Phone */}
        <div className='my-4 flex gap-4 items-center'>
          <label className='font-medium'>Contact Phone:</label>
          <input
            className='py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
            type='tel'
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>

        {/* Job Posting URL */}
        <div className='my-4 flex gap-4 items-center'>
          <label className='font-medium'>Job Posting URL:</label>
          <input
            className='py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
            type='url'
            value={jobPostingUrl}
            onChange={(e) => setJobPostingUrl(e.target.value)}
          />
        </div>

        {/* Priority */}
        <div className='my-4 flex gap-4 items-center'>
          <label className='font-medium'>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value='LOW'>Low</option>
            <option value='MEDIUM'>Medium</option>
            <option value='HIGH'>High</option>
          </select>
        </div>

        {/* Follow Up */}
        <div className='my-4 flex gap-4 items-center'>
          <label className='font-medium'>Follow Up?:</label>
          <input
            className='py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
            type='checkbox'
            checked={autoFollowUp}
            onChange={(e) => setAutoFollowUp(e.target.checked)}
          />
        </div>

        {/* Submit */}
        <button className='my-10 mx-auto w-full py-2 px-8 rounded-2xl shadow-md bg-blue-800 text-blue-50 font-bold cursor-pointer border transition-all duration-200 hover:bg-sky-500 hover:text-slate-950 hover:shadow-2xl' type='submit'>Create</button>
      </form>
    </div>
  )
}
