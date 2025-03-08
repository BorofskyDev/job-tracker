'use client'

import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  DocumentReference,
} from 'firebase/firestore'
import { User } from 'firebase/auth'

export interface InterviewData {
  jobId: string
  userId: string
  interviewDateTime: Date
  interviewers?: string
  contactInfo?: string
  notes?: string
}

function removeUndefinedFields<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>
}

export function useInterviews() {
  async function createInterview(currentUser: User, data: InterviewData) {
    // 1) Remove undefined fields
    const finalData = removeUndefinedFields({
      ...data,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
    })

    // 2) Add doc to 'interviews' collection
    const newInterviewRef: DocumentReference = await addDoc(
      collection(db, 'interviews'),
      finalData
    )

    // 3) Update the related job's outcome to "Interview"
    const jobDocRef = doc(db, 'jobs', data.jobId)
    await updateDoc(jobDocRef, { outcome: 'Interview' })

    return newInterviewRef
  }

  return { createInterview }
}
