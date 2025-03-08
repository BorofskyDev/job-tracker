'use client'

import { useState, useEffect, JSX } from 'react'

/**
 * Only the user-editable fields, with no Timestamp fields.
 */
export interface EditableJob {
  id: string
  companyName?: string
  jobTitle?: string
  outcome?: string // "Denied", "Hired", "Applied"
  notes?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  jobPostingUrl?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  autoFollowUp?: boolean
}

/**
 * The user-editable keys (same as keys of EditableJob).
 */
export type EditableField = keyof EditableJob

/**
 * The values for any field in EditableJob – only string/boolean/undefined.
 */
type EditableJobValue = string | boolean | undefined

/**
 * Our local "updates" object type: partial dictionary of user-editable fields.
 * For each field in EditableField, the value is optional but must be string|boolean|undefined.
 */
type EditableUpdate = {
  [K in EditableField]?: EditableJobValue
}

interface UseEditableFieldsReturn {
  localJob: EditableJob
  editingFields: Record<EditableField, boolean>
  hasChanges: boolean
  handleFieldClick: (field: EditableField) => void
  handleChange: (field: EditableField, value: string) => void
  handleBooleanChange: (field: EditableField, value: boolean) => void
  resetEditing: () => void
  renderEditableField: (
    field: EditableField,
    label: string,
    isTextArea?: boolean
  ) => JSX.Element
  handleSaveChanges: () => Promise<void>
}

/**
 * The callback that receives partial updates for the user-editable keys.
 */
export type UpdateEditableCallback = (
  updates: Partial<EditableJob>
) => Promise<void>

export function useEditableFields(
  initialJob: EditableJob,
  updateCallback: UpdateEditableCallback
): UseEditableFieldsReturn {
  const [localJob, setLocalJob] = useState<EditableJob>({ ...initialJob })

  // editingFields flags which fields are in "edit mode"
  const [editingFields, setEditingFields] = useState<
    Record<EditableField, boolean>
  >({
    id: false, // Usually won't toggle 'id', but let's keep it consistent
    companyName: false,
    jobTitle: false,
    outcome: false,
    notes: false,
    contactName: false,
    contactEmail: false,
    contactPhone: false,
    jobPostingUrl: false,
    priority: false,
    autoFollowUp: false,
  })

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Whenever initialJob changes (e.g. the parent re-renders with new data),
    // we reset localJob + editing states
    setLocalJob({ ...initialJob })
    setHasChanges(false)
    resetEditing()
  }, [initialJob.id])

  function handleFieldClick(field: EditableField) {
    setEditingFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  function handleChange(field: EditableField, value: string) {
    setLocalJob((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  function handleBooleanChange(field: EditableField, value: boolean) {
    setLocalJob((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  function resetEditing() {
    setEditingFields((prev) => {
      const reset = { ...prev }
      ;(Object.keys(reset) as EditableField[]).forEach((key) => {
        reset[key] = false
      })
      return reset
    })
  }

  /**
   * Build an "updates" object that only contains changed fields.
   * We store them in a plain dictionary first (EditableUpdate) to avoid TS errors.
   */
  async function handleSaveChanges() {
    const updates: EditableUpdate = {} // collects only changed fields

    ;(Object.keys(editingFields) as EditableField[]).forEach((field) => {
      const newValue = localJob[field]
      const oldValue = initialJob[field]
      if (newValue !== oldValue) {
        updates[field] = newValue // no type error now, thanks to EditableUpdate
      }
    })

    // If we have changes, cast `updates` to Partial<EditableJob> and pass to the callback
    if (Object.keys(updates).length > 0) {
      await updateCallback(updates as Partial<EditableJob>)
    }
    setHasChanges(false)
    resetEditing()
  }

  // Helper Renders for various field types

  function renderBoolean(field: EditableField, label: string) {
    return (
      <p>
        <strong>{label}:</strong>{' '}
        <input
          type='checkbox'
          checked={!!localJob[field]}
          onChange={(e) => handleBooleanChange(field, e.target.checked)}
        />
      </p>
    )
  }

  function renderTextArea(field: EditableField, label: string) {
    return (
      <p>
        <strong>{label}:</strong>{' '}
        <textarea
          className='border p-1'
          value={(localJob[field] as string) || ''}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      </p>
    )
  }

  function renderDropdown(
    field: EditableField,
    label: string,
    options: string[]
  ) {
    return (
      <p>
        <strong>{label}:</strong>{' '}
        <select
          className='border p-1'
          value={(localJob[field] as string) || ''}
          onChange={(e) => handleChange(field, e.target.value)}
        >
          <option value=''>Select...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </p>
    )
  }

  function renderTextInput(field: EditableField, label: string) {
    return (
      <p>
        <strong>{label}:</strong>{' '}
        <input
          className='border p-1'
          type='text'
          value={(localJob[field] as string) || ''}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      </p>
    )
  }

  function renderReadOnly(field: EditableField, label: string) {
    const value = localJob[field]
    if (typeof value === 'boolean') {
      return (
        <p onClick={() => handleFieldClick(field)}>
          <strong>{label}:</strong> {value ? 'Yes' : 'No'}
        </p>
      )
    }
    return (
      <p onClick={() => handleFieldClick(field)}>
        <strong>{label}:</strong> {value || ''}
      </p>
    )
  }

  /**
   * The main "renderEditableField" decides how to render the field based on whether
   * it's in edit mode, or if it's a special type (boolean, dropdown, textarea, etc.).
   */
  function renderEditableField(
    field: EditableField,
    label: string,
    isTextArea?: boolean
  ) {
    if (editingFields[field]) {
      if (field === 'autoFollowUp') {
        return renderBoolean(field, label)
      }
      if (field === 'priority') {
        const priorityOptions = ['LOW', 'MEDIUM', 'HIGH']
        return renderDropdown(field, label, priorityOptions)
      }
      if (field === 'outcome') {
        const outcomeOptions = ['Applied', 'Denied', 'Hired']
        return renderDropdown(field, label, outcomeOptions)
      }
      if (isTextArea) {
        return renderTextArea(field, label)
      }
      return renderTextInput(field, label)
    } else {
      return renderReadOnly(field, label)
    }
  }

  return {
    localJob,
    editingFields,
    hasChanges,
    handleFieldClick,
    handleChange,
    handleBooleanChange,
    resetEditing,
    renderEditableField,
    handleSaveChanges,
  }
}
