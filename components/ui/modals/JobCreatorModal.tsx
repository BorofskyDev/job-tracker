'use client'

import { FormEvent, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useJobs, JobData, Priority } from '@/lib/hooks/useJobs'
import { FormField } from '@/components/ui/inputs/FormField'
import { TextInput } from '@/components/ui/inputs/TextInput'
import { TextArea } from '@/components/ui/inputs/TextArea'

interface JobCreatorModalProps {
  onClose: () => void
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  // local date at noon to avoid timezone issues
  return new Date(year, month - 1, day, 12, 0, 0)
}

export default function JobCreatorModal({ onClose }: JobCreatorModalProps) {
  const { currentUser } = useAuth()
  const { createJob } = useJobs()

  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [appliedDate, setAppliedDate] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [notes, setNotes] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [jobPostingUrl, setJobPostingUrl] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [autoFollowUp, setAutoFollowUp] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!currentUser) {
      setErrorMessage('You must be logged in to create a job.')
      return
    }
    if (!companyName.trim() || !jobTitle.trim()) {
      setErrorMessage('Company name and job title are required.')
      return
    }

    const date = parseLocalDate(appliedDate)

    try {
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
      onClose()
    } catch (err) {
      console.error('Error creating job:', err)
      setErrorMessage('Error creating job. Please try again.')
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <h2 className='text-2xl font-bold'>Create a New Job Entry</h2>
      {errorMessage && <p className='text-red-600'>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <p className='text-sm flex items-center gap-4'>
          <span className='text-2xl text-red-800'>*</span> = required
        </p>

        <FormField label='Company Name' required>
          <TextInput
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </FormField>

        <FormField label='Job Title' required>
          <TextInput
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </FormField>

        <FormField label='Applied Date' required>
          {/* We can pass type="date" to our TextInput, or just do <input type="date" /> inline */}
          <TextInput
            type='date'
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
          />
        </FormField>

        <FormField label='Notes'>
          <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </FormField>

        <FormField label='Contact Name'>
          <TextInput
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </FormField>

        <FormField label='Contact Email'>
          <TextInput
            type='email'
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </FormField>

        <FormField label='Contact Phone'>
          <TextInput
            type='tel'
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </FormField>

        <FormField label='Job Posting URL'>
          <TextInput
            type='url'
            value={jobPostingUrl}
            onChange={(e) => setJobPostingUrl(e.target.value)}
          />
        </FormField>

        <FormField label='Priority'>
          <select
            className='py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value='LOW'>Low</option>
            <option value='MEDIUM'>Medium</option>
            <option value='HIGH'>High</option>
          </select>
        </FormField>

        <FormField label='Follow Up?'>
          <input
            className='py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
            type='checkbox'
            checked={autoFollowUp}
            onChange={(e) => setAutoFollowUp(e.target.checked)}
          />
        </FormField>

        <button
          className='my-10 mx-auto w-full py-2 px-8 rounded-2xl shadow-md bg-blue-800 text-blue-50 font-bold cursor-pointer border transition-all duration-200 hover:bg-sky-500 hover:text-slate-950 hover:shadow-2xl'
          type='submit'
        >
          Create
        </button>
      </form>
    </div>
  )
}
