// settingsStore.js
import axios from '@/lib/axios'
import { Field } from '@/type/api'
import { StateCreator, StoreApi, UseBoundStore, create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AvailableFieldsState {
  fields: Field[]
  fetchFields: () => Promise<void>
  getFieldById: (id: string) => Field | null
}

const useFieldsStore: UseBoundStore<StoreApi<AvailableFieldsState>> =
  create<AvailableFieldsState>()(
    persist(
      (set) => ({
        fields: [],
        fetchFields: async () => {
          try {
            const response = await axios.get('/available-fields', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            })
            set({ fields: response.data.data })
          } catch (error) {
            console.error('Error fetching available fields:', error)
          }
        },

        getFieldById: (id) => {
          // Get a specific setting by its key
          useFieldsStore.getState().fetchFields()
          return (
            (useFieldsStore.getState().fields || []).find((field: Field) => field.id === id) || null
          )
        },
      }),
      {
        name: 'settings-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )

// Create a singleton instance of the store
export { useFieldsStore }
