// settingsStore.js
import { baseURL } from '@/lib/axios'
import { Setting } from '@/type/api'
import Axios from 'axios'
import { create } from 'zustand'

interface SettingsState {
  settings: Setting[] | null
  fetchSettings: () => Promise<void>
  updateSetting: (newSetting: Setting) => Promise<void>
  getSettingByKey: (key: string) => Setting | null
}

// Need to re-create Axios instance, because the auth cannot be injected here
const axios = Axios.create({
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  baseURL: baseURL,
})

if (typeof window !== 'undefined' && localStorage.getItem('token')) {
  const token = localStorage.getItem('token')
  axios.defaults.headers.common = { Authorization: `Bearer ${token}` }
}

const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  fetchSettings: async () => {
    try {
      const response = await axios.get('/settings')
      set({ settings: response.data })
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  },
  updateSetting: async (newSetting) => {
    try {
      // Make a request to update the settings on the server
      // For simplicity, let's assume a hypothetical update endpoint
      await axios.put(`/settings/${newSetting.id}`, newSetting)

      // Update the state with the new settings
      set((state) => ({
        settings: state.settings?.map((setting) =>
          setting.id === newSetting.id ? newSetting : setting
        ),
      }))
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  },
  getSettingByKey: (key): Setting | null => {
    // Get a specific setting by its ID
    return (
      (useSettingsStore.getState().settings || []).find(
        (setting: Setting) => setting.key === key
      ) || null
    )
  },
}))

// Create a singleton instance of the store
export { useSettingsStore }
