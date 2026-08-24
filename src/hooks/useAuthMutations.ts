import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { api } from '../api/axiosInstance'
import type { LoginCredentials, LoginApiResponse } from '../types/auth'
import { useAuthStore } from '../store/useAuthStore'

export function useLoginMutation() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation<LoginApiResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const response = await api.post<LoginApiResponse>('/auth/login', credentials)
        return response.data
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data?.message) {
          throw new Error(err.response.data.message)
        }
        if (err instanceof Error) {
          throw err
        }
        throw new Error('Login failed. Please check your credentials.')
      }
    },
    onSuccess: (data) => {
      const { token, user } = data.data
      if (token) {
        setAuth(token, user)
      }
    },
  })
}
