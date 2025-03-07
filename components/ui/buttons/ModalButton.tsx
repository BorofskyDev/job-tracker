'use client'

import { useState, ReactNode } from 'react'
import Modal from '@/components/modals/Modal'

interface ModalButtonProps {
  /** The label for the button that triggers the modal */
  buttonLabel: string
  /**
   * A function that renders your modal content. We pass in a `closeModal` callback
   * so the child can close the modal if needed (i.e. after a successful action).
   */
  modalContent: (closeModal: () => void) => ReactNode
}

/**
 * A reusable button + modal wrapper.
 * You provide a button label and a "render function" to supply the modal content.
 */
export default function ModalButton({
  buttonLabel,
  modalContent,
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
      <button onClick={openModal}>{buttonLabel}</button>
      {isOpen && <Modal onClose={closeModal}>{modalContent(closeModal)}</Modal>}
    </>
  )
}
