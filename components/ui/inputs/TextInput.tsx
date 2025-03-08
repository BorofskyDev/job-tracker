'use client'

import { ChangeEvent } from 'react'

interface TextInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  type?: string // default 'text'
}

export function TextInput({
  value,
  onChange,
  required,
  type = 'text',
}: TextInputProps) {
  return (
    <input
      className='py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
      type={type}
      required={required}
      value={value}
      onChange={onChange}
    />
  )
}
