'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import ModalButton from '@/components/ui/buttons/ModalButton'
import JobCreatorModal from '@/components/modals/JobCreatorModal'
import JobList from '@/components/ui/tabls/JobList'

export default function ProfilePage() {
  const { currentUser, loading } = useAuth()
  const router = useRouter()

  // Check auth on mount
  useEffect(() => {
    // If not loading and user is not logged in, redirect
    if (!loading && !currentUser) {
      router.push('/login')
    }
  }, [currentUser, loading, router])

  async function handleSignOut() {
    await signOut(auth)
    router.push('/login')
  }

  // If loading, we can show a spinner or message
  if (loading) {
    return <p>Loading...</p>
  }

  // If there's no user (and not loading), redirect or show something
  if (!currentUser) {
    return null // or a fallback
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Welcome, {currentUser.email}</p>
      <div>
        <h2>Actions</h2>
        <div>
          <ModalButton
            buttonLabel='Add Job'
            modalContent={(closeModal) => (
              <JobCreatorModal onClose={closeModal} />
            )}
          />
        </div>
      </div>
      <div>
        <h2>Jobs</h2>
        <JobList />
      </div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}
