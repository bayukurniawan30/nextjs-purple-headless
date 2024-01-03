import { Field } from '@/type/api'
import { create } from 'zustand'
import * as yup from 'yup'

export interface TemporaryField extends Field {
  page: 'singleton' | 'collection'
  label: string
  helperText: string
  uniqueId: string
}

interface AddedFieldsState {
  fields: TemporaryField[]
  addNewField: (field: TemporaryField) => void
  updateField: (field: TemporaryField) => void
  removeField: (id: string) => void
}

const useAddedFields = create<AddedFieldsState>()((set) => ({
  fields: [],
  addNewField: (field: TemporaryField) => {
    set((state) => ({
      fields: [...state.fields, field],
    }))
  },
  updateField: (field: TemporaryField) => {
    set((state) => ({
      fields: state.fields.map((f) => (f.uniqueId === field.uniqueId ? field : f)),
    }))
  },
  removeField: (id: string) => {
    set((state) => ({
      fields: state.fields.filter((field) => field.uniqueId !== id),
    }))
  },
}))

// Create a singleton instance of the store
export { useAddedFields }
