import { Field } from '@/type/api'
import { create } from 'zustand'

interface TemporaryField extends Field {
  page: 'singleton' | 'collection'
  uniqueId: string
}

interface AddedFieldsState {
  fields: TemporaryField[]
  addNewField: (field: TemporaryField) => void
  removeField: (id: string) => void
}

const useAddedFields = create<AddedFieldsState>()((set) => ({
  fields: [],
  addNewField: (field: TemporaryField) => {
    set((state) => ({
      fields: [...state.fields, field],
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
