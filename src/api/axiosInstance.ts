import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://10.10.7.10:5002/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

// Request interceptor to attach Bearer token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
