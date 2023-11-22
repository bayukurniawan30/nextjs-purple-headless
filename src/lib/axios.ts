import Axios from 'axios'
import { enqueueSnackbar } from 'notistack'

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

const axios = Axios.create({
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*',
  },
  baseURL: baseURL,
})

if (typeof window !== 'undefined' && localStorage.getItem('token')) {
  const token = localStorage.getItem('token')
  axios.defaults.headers.common = { Authorization: `Bearer ${token}` }
}

axios.interceptors.response.use(
  (response) => {
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
