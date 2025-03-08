'use client'

import { useState, ReactNode } from 'react'
import Modal from '@/components/ui/modals/Modal'

interface ModalButtonProps {
  buttonLabel: string
  className?: string
  modalContent: (closeModal: () => void) => ReactNode
}

/**
 * A reusable button + modal wrapper.
 * You provide a button label and a "render function" to supply the modal content.
 */
export default function ModalButton({
  buttonLabel,
  modalContent,
  className,
}: ModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <>
      <button
        className={`text-lg font-bold border py-2 px-8 rounded-3xl shadow-md transition-all duration-200 hover:shadow-xl cursor-pointer ${className}`}
        onClick={openModal}
      >
        {buttonLabel}
      </button>
      {isOpen && <Modal onClose={closeModal}>{modalContent(closeModal)}</Modal>}
    </>
  )
}
