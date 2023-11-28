import Axios from 'axios'
import { enqueueSnackbar } from 'notistack'

export const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

const axios = Axios.create({
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  baseURL: baseURL,
})

axios.interceptors.response.use(
  (response) => {
    const token = localStorage.getItem('token') // replace with your actual key

    // Set the Bearer token in the request headers
    if (token) {
      response.headers.Authorization = `Bearer ${token}`
    }

    return response
  },
  (error) => {
    enqueueSnackbar(`Failed to process your request. Please try again`, {
      variant: 'error',
      anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
    })

    // Trigger an alert here (e.g., using a notification library or custom function)
    return Promise.reject(error)
  }
)

export default axios
