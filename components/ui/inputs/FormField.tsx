'use client'

import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
  required?: boolean
}

export function FormField({ label, children, required }: FormFieldProps) {
  return (
    <div className='my-4 flex justify-between items-center'>
      <label className='font-medium'>
        {label}
        {required && <span className='text-2xl text-red-800'> *</span>}:
      </label>
      {children}
    </div>
  )
}
