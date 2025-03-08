// lib/hooks/useDocuments.ts
'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'

/**
 * Each document in the "resumes" or "coverLetters" collection
 * might look like this:
 * {
 *   id: string,
 *   title: string,
 *   filePath: string, // path in Firebase Storage
 *   createdAt: Timestamp
 *   ...
 * }
 */
export interface DocumentRecord {
  id: string
  title: string
  filePath: string
  [key: string]: unknown // for extra fields
}

interface UseDocumentsResult {
  documents: DocumentRecord[]
  uploadDocument: (file: File, title: string) => Promise<void>
  getDownloadUrl: (docId: string) => Promise<string>
}

/**
 * Reusable hook for managing docs in Firestore + files in Firebase Storage.
 * e.g. "resumes" or "coverLetters".
 */
export function useDocuments(
  collectionName: string,
  storageFolder: string
): UseDocumentsResult {
  const [documents, setDocuments] = useState<DocumentRecord[]>([])

  useEffect(() => {
    const colRef = collection(db, collectionName)
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as DocumentRecord[]
      setDocuments(docs)
    })

    return () => unsubscribe()
  }, [collectionName])

  // Upload a file to storage, create doc in Firestore
  async function uploadDocument(file: File, title: string) {
    // 1. Upload file to Firebase Storage in e.g. "resumesFiles/<some random>"
    const storageRef = ref(
      storage,
      `${storageFolder}${file.name}-${Date.now()}`
    )
    await uploadBytes(storageRef, file)

    // 2. Create a doc in Firestore with the file path + title
    await addDoc(collection(db, collectionName), {
      title,
      filePath: storageRef.fullPath,
      createdAt: new Date(),
    })
  }

  // Download logic – given a doc ID, we fetch the doc, get filePath, then getDownloadUrl
  async function getDownloadUrl(docId: string): Promise<string> {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) throw new Error('Document not found')

    const data = docSnap.data() as DocumentRecord
    const fileRef = ref(storage, data.filePath)
    const downloadUrl = await getDownloadURL(fileRef)
    return downloadUrl
  }

  return { documents, uploadDocument, getDownloadUrl }
}
