'use client'

import { ChangeEvent } from 'react'

interface TextAreaProps {
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
}

export function TextArea({ value, onChange, rows = 3 }: TextAreaProps) {
  return (
    <textarea
      className='py-2 px-4 border rounded-md shadow-lg bg-sky-200 text-medium focus:bg-blue-200'
      value={value}
      onChange={onChange}
      rows={rows}
    />
  )
}
