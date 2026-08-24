import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { AxiosError } from 'axios'
import { api } from '../api/axiosInstance'
import type { UserAnalyticsResponse } from '../types/analytics'

export function useUsersAnalytics(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['analytics', 'users', page, limit],
    queryFn: async () => {
      const response = await api.get<UserAnalyticsResponse>(
        `/analytics/users?page=${page}&limit=${limit}`
      )
      return response.data
    },
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'ACTIVE' | 'INACTIVE' }) => {
      const response = await api.patch(`/users/status/${userId}`, { status })
      return response.data
    },
    onSuccess: (data) => {
      message.success(data?.message || 'User status updated successfully')
      queryClient.invalidateQueries({ queryKey: ['analytics', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['analytics', 'stats'] })
    },
    onError: (err: unknown) => {
      let errMsg = 'Failed to update user status'
      if (err instanceof AxiosError && err.response?.data?.message) {
        errMsg = err.response.data.message
      } else if (err instanceof Error) {
        errMsg = err.message
      }
      message.error(errMsg)
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.delete(`/users/${userId}`)
      return response.data
    },
    onSuccess: (data) => {
      message.success(data?.message || 'User deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['analytics', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['analytics', 'stats'] })
    },
    onError: (err: unknown) => {
      let errMsg = 'Failed to delete user'
      if (err instanceof AxiosError && err.response?.data?.message) {
        errMsg = err.response.data.message
      } else if (err instanceof Error) {
        errMsg = err.message
      }
      message.error(errMsg)
    },
  })
}
