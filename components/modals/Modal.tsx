'use client'

import { ReactNode } from 'react'

interface ModalProps {
  children: ReactNode
  onClose: () => void
}

export default function Modal({ children, onClose }: ModalProps) {
  function handleContainerClick(e: React.MouseEvent) {
    // Prevent clicks inside the modal from closing it
    e.stopPropagation()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        onClick={handleContainerClick}
        style={{
          background: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          minWidth: '300px',
          maxWidth: '90%',
        }}
      >
        <button
          style={{ float: 'right' }}
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
