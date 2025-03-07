'use client'

import { FormEvent, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useJobs, JobData, Priority } from '@/lib/hooks/useJobs'

interface JobCreatorModalProps {
  onClose: () => void
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

    try {
      // Construct the job data
      const jobData: JobData = {
        companyName,
        jobTitle,
        appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
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
    <div>
      <h2>Create a New Job Entry</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        {/* Company Name */}
        <div>
          <label>Company Name:</label>
          <input
            type='text'
            value={companyName}
            required
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        {/* Job Title */}
        <div>
          <label>Job Title:</label>
          <input
            type='text'
            value={jobTitle}
            required
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        {/* Applied Date */}
        <div>
          <label>Applied Date:</label>
          <input
            type='date'
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div>
          <label>Notes:</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {/* Contact Name */}
        <div>
          <label>Contact Name:</label>
          <input
            type='text'
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>

        {/* Contact Email */}
        <div>
          <label>Contact Email:</label>
          <input
            type='email'
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label>Contact Phone:</label>
          <input
            type='tel'
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>

        {/* Job Posting URL */}
        <div>
          <label>Job Posting URL:</label>
          <input
            type='url'
            value={jobPostingUrl}
            onChange={(e) => setJobPostingUrl(e.target.value)}
          />
        </div>

        {/* Priority */}
        <div>
          <label>Priority:</label>
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
        <div>
          <label>Follow Up:</label>
          <input
            type='checkbox'
            checked={autoFollowUp}
            onChange={(e) => setAutoFollowUp(e.target.checked)}
          />
        </div>

        {/* Submit */}
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}
