// settingsStore.js
import axios from '@/lib/axios'
import { Setting } from '@/type/api'
import { StateCreator, StoreApi, UseBoundStore, create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SettingsState {
  settings: Setting[]
  fetchSettings: () => Promise<void>
  updateSetting: (newSetting: Setting) => Promise<void>
  getSettingByKey: (key: string) => Setting | null
}

const useSettingsStore: UseBoundStore<StoreApi<SettingsState>> = create<SettingsState>()(
  persist(
    (set) => ({
      settings: [],
      fetchSettings: async () => {
        try {
          const response = await axios.get('/settings', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          set({ settings: response.data.data })
        } catch (error) {
          console.error('Error fetching settings:', error)
        }
      },
      updateSetting: async (newSetting) => {
        try {
          // Make a request to update the settings on the server
          // For simplicity, let's assume a hypothetical update endpoint
          await axios.put(`/settings/${newSetting.id}`, newSetting, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })

          // Update the state with the new settings
          set((state) => ({
            settings: state.settings.map((setting) =>
              setting.id === newSetting.id ? newSetting : setting
            ),
          }))
        } catch (error) {
          console.error('Error updating settings:', error)
        }
      },
      getSettingByKey: (key) => {
        // Get a specific setting by its key
        useSettingsStore.getState().fetchSettings()
        return (
          (useSettingsStore.getState().settings || []).find(
            (setting: Setting) => setting.key === key
          ) || null
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
export { useSettingsStore }
