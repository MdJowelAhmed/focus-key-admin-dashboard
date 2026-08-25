import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { AxiosError } from 'axios'
import { api } from '../api/axiosInstance'
import type {
  CreateDevicePayload,
  DevicesResponse,
  UpdateDevicePayload,
} from '../types/devices'

export function useDevices({
  page = 1,
  limit = 10,
  searchTerm = '',
}: {
  page?: number
  limit?: number
  searchTerm?: string
} = {}) {
  return useQuery({
    queryKey: ['devices', page, limit, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })

      if (searchTerm.trim()) {
        params.append('searchTerm', searchTerm.trim())
      }

      const response = await api.get<DevicesResponse>(`/devices?${params.toString()}`)
      return response.data
    },
  })
}

export function useCreateDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateDevicePayload) => {
      const response = await api.post('/devices', payload)
      return response.data
    },
    onSuccess: (data) => {
      message.success(data?.message || 'Device created successfully')
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
    onError: (err: unknown) => {
      let errMsg = 'Failed to create device'
      if (err instanceof AxiosError && err.response?.data?.message) {
        errMsg = err.response.data.message
      } else if (err instanceof Error) {
        errMsg = err.message
      }
      message.error(errMsg)
    },
  })
}

export function useUpdateDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateDevicePayload }) => {
      const response = await api.patch(`/devices/${id}`, payload)
      return response.data
    },
    onSuccess: (data) => {
      message.success(data?.message || 'Device updated successfully')
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
    onError: (err: unknown) => {
      let errMsg = 'Failed to update device'
      if (err instanceof AxiosError && err.response?.data?.message) {
        errMsg = err.response.data.message
      } else if (err instanceof Error) {
        errMsg = err.message
      }
      message.error(errMsg)
    },
  })
}

export function useDeleteDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/devices/${id}`)
      return response.data
    },
    onSuccess: (data) => {
      message.success(data?.message || 'Device deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
    onError: (err: unknown) => {
      let errMsg = 'Failed to delete device'
      if (err instanceof AxiosError && err.response?.data?.message) {
        errMsg = err.response.data.message
      } else if (err instanceof Error) {
        errMsg = err.message
      }
      message.error(errMsg)
    },
  })
}
