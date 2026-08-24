import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../api/axiosInstance'
import type { LoginCredentials, LoginApiResponse, User } from '../types/auth'
import { AxiosError } from 'axios'

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<LoginApiResponse>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: localStorage.getItem('token') || null,
      user: null,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post<LoginApiResponse>('/auth/login', credentials)
          const { token, user } = response.data.data

          // Set token in localStorage for easy access by axios interceptor
          if (token) {
            localStorage.setItem('token', token)
          }

          set({
            token,
            user,
            isLoading: false,
            error: null,
          })

          return response.data
        } catch (err: unknown) {
          let errorMessage = 'Login failed. Please try again.'
          if (err instanceof AxiosError && err.response?.data?.message) {
            errorMessage = err.response.data.message
          } else if (err instanceof Error) {
            errorMessage = err.message
          }

          set({
            isLoading: false,
            error: errorMessage,
          })
          throw new Error(errorMessage)
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        set({
          token: null,
          user: null,
          error: null,
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // key in localStorage
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
