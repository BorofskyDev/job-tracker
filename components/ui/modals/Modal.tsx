'use client'

import { ReactNode, useEffect } from 'react'

interface ModalProps {
  children: ReactNode
  onClose: () => void
}

export default function Modal({ children, onClose }: ModalProps) {
  // Prevent scrolling of the background while the modal is open
  useEffect(() => {
    // Hide scroll on mount
    document.body.style.overflow = 'hidden'

    // Cleanup: restore scroll on unmount
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  function handleContainerClick(e: React.MouseEvent) {
    e.stopPropagation() // prevent clicks inside the modal from closing it
  }

  return (
    <div
      onClick={onClose}
      className='fixed top-0 left-0 w-full h-full bg-black/80 flex justify-center items-center z-50'
    >
      <div
        onClick={handleContainerClick}
        className='fixed max-h-dvh overflow-auto my-10 p-8 border rounded-2xl bg-sky-50'
      >
        <button
          className='float-right border py-2 px-4 rounded-full bg-sky-200 text-slate-950 font-bold transition-all duration-200 hover:bg-red-50 cursor-pointer'
          onClick={onClose}
          aria-label='Close Modal'
        >
          X
        </button>
        {children}
      </div>
    </div>
  )
}
