import { Check, Edit2, GripVertical, Plus, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'

export interface FormField {
  id: string
  name: string
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea'
  label: string
  required: boolean
  placeholder?: string
  value?: string
  order: number
}

export interface FormSchema {
  fields: FormField[]
}

interface FormBuilderProps {
  schema: FormSchema
  onSchemaChange: (schema: FormSchema) => void
  disabled?: boolean
  onFieldUpdate?: (fieldId: string, value: string) => void
}

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'date', label: 'Date' },
  { value: 'textarea', label: 'Textarea' },
]

const defaultFields: FormField[] = [
  {
    id: 'firstName',
    name: 'firstName',
    type: 'text',
    label: 'First name',
    required: true,
    placeholder: 'Enter your first name',
    order: 1,
  },
  {
    id: 'lastName',
    name: 'lastName',
    type: 'text',
    label: 'Last name',
    required: true,
    placeholder: 'Enter your last name',
    order: 2,
  },
  {
    id: 'birthday',
    name: 'birthday',
    type: 'date',
    label: 'Birthday date',
    required: false,
    order: 3,
  },
  {
    id: 'city',
    name: 'city',
    type: 'text',
    label: 'City',
    required: false,
    placeholder: 'Enter your city',
    order: 4,
  },
  {
    id: 'zipCode',
    name: 'zipCode',
    type: 'text',
    label: 'Zip code',
    required: false,
    placeholder: 'Enter your zip code',
    order: 5,
  },
  {
    id: 'message',
    name: 'message',
    type: 'textarea',
    label: 'Message',
    required: false,
    placeholder: 'Enter your message',
    order: 6,
  },
]

export default function FormBuilder({
  schema,
  onSchemaChange,
  disabled = false,
  onFieldUpdate,
}: FormBuilderProps) {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [draggedField, setDraggedField] = useState<string | null>(null)

  const sortedFields = [...schema.fields].sort((a, b) => a.order - b.order)

  const generateId = () =>
    `field_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`

  const addField = useCallback(() => {
    if (disabled) return

    const newField: FormField = {
      id: generateId(),
      name: `field${schema.fields.length + 1}`,
      type: 'text',
      label: 'New Field',
      required: false,
      placeholder: '',
      order: Math.max(...schema.fields.map((f) => f.order), 0) + 1,
    }

    onSchemaChange({
      ...schema,
      fields: [...schema.fields, newField],
    })

    setEditingField(newField.id)
  }, [schema, onSchemaChange, disabled])

  const updateField = useCallback(
    (fieldId: string, updates: Partial<FormField>) => {
      if (disabled) return

      onSchemaChange({
        ...schema,
        fields: schema.fields.map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field
        ),
      })
    },
    [schema, onSchemaChange, disabled]
  )

  const deleteField = useCallback(
    (fieldId: string) => {
      if (disabled) return

      onSchemaChange({
        ...schema,
        fields: schema.fields.filter((field) => field.id !== fieldId),
      })
    },
    [schema, onSchemaChange, disabled]
  )

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    if (disabled) return
    setDraggedField(fieldId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault()
    if (!draggedField || draggedField === targetFieldId || disabled) return

    const draggedIndex = sortedFields.findIndex((f) => f.id === draggedField)
    const targetIndex = sortedFields.findIndex((f) => f.id === targetFieldId)

    const newFields = [...sortedFields]
    const [draggedItem] = newFields.splice(draggedIndex, 1)
    newFields.splice(targetIndex, 0, draggedItem)

    const reorderedFields = newFields.map((field, index) => ({
      ...field,
      order: index + 1,
    }))

    onSchemaChange({
      ...schema,
      fields: reorderedFields,
    })

    setDraggedField(null)
  }

  const handleFieldValueChange = (fieldId: string, value: string) => {
    updateField(fieldId, { value })
    onFieldUpdate?.(fieldId, value)
  }

  const resetToDefault = useCallback(() => {
    if (disabled) return
    onSchemaChange({ fields: defaultFields })
  }, [onSchemaChange, disabled])

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neon-purple neon-glow">
          Form Builder
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetToDefault}
            disabled={disabled}
            className="btn-secondary text-sm px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset to Default
          </button>
          <button
            onClick={addField}
            disabled={disabled}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Add Field</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedFields.map((field) => (
          <div
            key={field.id}
            className={`border border-dark-border rounded-lg p-4 transition-all duration-200 ${
              draggedField === field.id ? 'opacity-50' : ''
            } ${disabled ? 'bg-gray-900/50' : 'hover:border-neon-blue/50'}`}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, field.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, field.id)}
          >
            <div className="flex items-center space-x-3">
              {!disabled && (
                <button
                  className="text-gray-400 hover:text-gray-300 cursor-grab active:cursor-grabbing"
                  onMouseDown={() => setDraggedField(field.id)}
                >
                  <GripVertical className="w-4 h-4" />
                </button>
              )}

              <div className="flex-1 space-y-3">
                {editingField === field.id && !disabled ? (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        updateField(field.id, { label: e.target.value })
                      }
                      className="px-3 py-2 bg-dark-bg border border-dark-border rounded text-white focus:border-neon-blue focus:outline-none"
                      placeholder="Field label"
                    />
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) =>
                        updateField(field.id, { name: e.target.value })
                      }
                      className="px-3 py-2 bg-dark-bg border border-dark-border rounded text-white focus:border-neon-blue focus:outline-none"
                      placeholder="Field name"
                    />
                    <select
                      value={field.type}
                      onChange={(e) =>
                        updateField(field.id, {
                          type: e.target.value as FormField['type'],
                        })
                      }
                      className="px-3 py-2 bg-dark-bg border border-dark-border rounded text-white focus:border-neon-blue focus:outline-none"
                    >
                      {fieldTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={field.placeholder || ''}
                      onChange={(e) =>
                        updateField(field.id, { placeholder: e.target.value })
                      }
                      className="px-3 py-2 bg-dark-bg border border-dark-border rounded text-white focus:border-neon-blue focus:outline-none"
                      placeholder="Placeholder text"
                    />
                    <label className="flex items-center space-x-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(field.id, { required: e.target.checked })
                        }
                        className="rounded bg-dark-bg border-dark-border text-neon-blue focus:ring-neon-blue"
                      />
                      <span>Required</span>
                    </label>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 items-center gap-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {field.label}
                      {field.required && (
                        <span className="text-red-400 ml-1">*</span>
                      )}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={field.value || ''}
                        onChange={(e) =>
                          handleFieldValueChange(field.id, e.target.value)
                        }
                        placeholder={field.placeholder}
                        disabled={disabled}
                        className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-white focus:border-neon-blue focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        rows={3}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={field.value || ''}
                        onChange={(e) =>
                          handleFieldValueChange(field.id, e.target.value)
                        }
                        placeholder={field.placeholder}
                        disabled={disabled}
                        className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-white focus:border-neon-blue focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    )}
                  </div>
                )}
              </div>

              {!disabled && (
                <div className="flex items-center space-x-2">
                  {editingField === field.id ? (
                    <button
                      onClick={() => setEditingField(null)}
                      className="text-green-400 hover:text-green-300 p-1"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingField(field.id)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteField(field.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {sortedFields.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No fields added yet. Click "Add Field" to get started.</p>
        </div>
      )}
    </div>
  )
}

export { defaultFields }
