import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { AxiosError } from 'axios'
import { api } from '../api/axiosInstance'
import type { UserAnalyticsResponse } from '../types/analytics'

export function useUsersAnalytics({
  page = 1,
  limit = 10,
  searchTerm = '',
  status = '',
}: {
  page?: number
  limit?: number
  searchTerm?: string
  status?: string
} = {}) {
  return useQuery({
    queryKey: ['analytics', 'users', page, limit, searchTerm, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })

      if (searchTerm.trim()) {
        params.append('searchTerm', searchTerm.trim())
      }

      if (status && status !== 'ALL') {
        params.append('status', status)
      }

      const response = await api.get<UserAnalyticsResponse>(
        `/analytics/users?${params.toString()}`
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
