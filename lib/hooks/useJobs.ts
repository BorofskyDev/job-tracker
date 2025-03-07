'use client'

import { db } from '@/lib/firebase'
import {
  addDoc,
  collection,
  serverTimestamp,
  DocumentReference,
} from 'firebase/firestore'
import { User } from 'firebase/auth'

// A small enumeration for priority – or you could keep it as a string union type.
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface JobData {
  companyName: string
  jobTitle: string
  appliedDate: Date
  notes?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  jobPostingUrl?: string
  priority?: Priority
  autoFollowUp?: boolean
}

function removeUndefinedFields<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>
}




export function useJobs() {
  async function createJob(
    currentUser: User,
    jobData: JobData
  ): Promise<DocumentReference> {

    const finalData = removeUndefinedFields({
      ...jobData,
      userId: currentUser.uid,
      outcome: 'Applied', // default
      // We'll use the priority from jobData if present, else MEDIUM
      priority: jobData.priority || 'MEDIUM',
      // We'll use autoFollowUp from jobData if present, else false
      autoFollowUp: jobData.autoFollowUp ?? false,
      createdAt: serverTimestamp(),
    })
    // Add doc to 'jobs' collection
    const docRef = await addDoc(collection(db, 'jobs'), finalData)

    return docRef
  }

  return { createJob }
}
