// settingsStore.js
import axios, { baseURL } from '@/lib/axios'
import { Setting } from '@/type/api'
import Axios from 'axios'
import { create } from 'zustand'

interface SettingsState {
  settings: Setting[]
  fetchSettings: () => Promise<void>
  updateSetting: (newSetting: Setting) => Promise<void>
  getSettingByKey: (key: string) => Setting | null
}

// Need to re-create Axios instance, because the auth cannot be injected here
// const axios = Axios.create({
//   withCredentials: true,
//   headers: {
//     'X-Requested-With': 'XMLHttpRequest',
//   },
//   baseURL: baseURL,
// })

// if (typeof window !== 'undefined' && localStorage.getItem('token')) {
//   const token = localStorage.getItem('token')
//   axios.defaults.headers.common = { Authorization: `Bearer ${token}` }
// }

const useSettingsStore = create<SettingsState>((set) => ({
  settings: [],
  fetchSettings: async () => {
    try {
      const response = await axios.get('/settings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      console.log('🚀 ~ file: settings.ts:33 ~ fetchSettings: ~ response:', response)
      set({ settings: response.data.data })
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
    console.log(useSettingsStore.getState().settings)
    return (
      (useSettingsStore.getState().settings || []).find(
        (setting: Setting) => setting.key === key
      ) || null
    )
  },
}))

// Create a singleton instance of the store
export { useSettingsStore }
