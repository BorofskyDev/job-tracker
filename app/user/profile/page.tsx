'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import ModalButton from '@/components/ui/buttons/ModalButton'
import JobCreatorModal from '@/components/ui/modals/JobCreatorModal'
import JobList from '@/components/ui/tables/JobList'
import CoverLetterManager from '@/components/ui/modals/CoverLetterManagerModal'
import ResumeManager from '@/components/ui/modals/ResumeManagerModal'

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
    <div className='py-20 px-10'>
      <h1 className='text-4xl font-extrabold text-center uppercase mb-10'>
        User Profile
      </h1>
      <p className='text-2xl font-medium text-center'>
        Welcome, {currentUser.email}
      </p>
      <div className='my-10'>
        <h2 className='text-xl font-semibold'>Actions</h2>
        <div className='py-6 flex flex-wrap justify-center align-middle gap-6'>
          <ModalButton
            buttonLabel='Add Job'
            className='bg-sky-200 hover:bg-blue-200'
            modalContent={(closeModal) => (
              <JobCreatorModal onClose={closeModal} />
            )}
          />
          <ResumeManager />
          <CoverLetterManager />
        </div>
      </div>
      <div>
        <h2 className='text-xl font-semibold'>Jobs</h2>
        <JobList />
      </div>
      <button
        className='mt-10 py-2 px-8 border rounded-2xl cursor-pointer bg-rose-300 font-bold transition-all duration-200 shadow-md hover:shadow-xl hover:bg-rose-900 hover:text-blue-50'
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  )
}
