import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { AxiosError } from 'axios'
import { api } from '../api/axiosInstance'
import type {
  ChangePasswordPayload,
  ChangePasswordResponse,
  ProfileResponse,
  UpdateProfilePayload,
} from '../types/profile'
import { useAuthStore } from '../store/useAuthStore'

export function useGetProfile() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ['users', 'profile'],
    queryFn: async () => {
      const response = await api.get<ProfileResponse>('/users/profile')
      const profileUser = response.data.data
      if (profileUser && token) {
        setAuth(token, profileUser)
      }
      return profileUser
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)
  const token = useAuthStore((state) => state.token)

  return useMutation({
    mutationFn: async ({
      data,
      file,
    }: {
      data: UpdateProfilePayload
      file?: File | null
    }) => {
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      if (data.name) formData.append('name', data.name)
      if (data.email) formData.append('email', data.email)

      if (file) {
        formData.append('profileImage', file)
      }

      const response = await api.patch<ProfileResponse>('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: (resData) => {
      message.success(resData?.message || 'Profile updated successfully')
      if (resData?.data && token) {
        setAuth(token, resData.data)
      }
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] })
    },
    onError: (err: unknown) => {
      let errMsg = 'Failed to update profile'
      if (err instanceof AxiosError && err.response?.data?.message) {
        errMsg = err.response.data.message
      } else if (err instanceof Error) {
        errMsg = err.message
      }
      message.error(errMsg)
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const response = await api.post<ChangePasswordResponse>(
        '/auth/change-password',
        payload
      )
      return response.data
    },
    onSuccess: (resData) => {
      message.success(resData?.message || 'Password changed successfully')
    },
    onError: (err: unknown) => {
      let errMsg = 'Failed to change password'
      if (err instanceof AxiosError && err.response?.data?.message) {
        errMsg = err.response.data.message
      } else if (err instanceof Error) {
        errMsg = err.message
      }
      message.error(errMsg)
    },
  })
}
