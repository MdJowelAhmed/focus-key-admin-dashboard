import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { AxiosError } from 'axios'
import { api } from '../api/axiosInstance'
import type { CreateFaqPayload, FaqResponse, UpdateFaqPayload } from '../types/faq'

export function useFaqs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const response = await api.get<FaqResponse>('/faqs')
      return response.data.data
    },
  })
}

export function useCreateFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateFaqPayload) => {
      const response = await api.post('/faqs', payload)
      return response.data
    },
    onSuccess: (data) => {
      message.success(data?.message || 'FAQ created successfully')
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
    onError: (err: unknown) => {
      let errMsg = 'Failed to create FAQ'
      if (err instanceof AxiosError && err.response?.data?.message) {
        errMsg = err.response.data.message
      } else if (err instanceof Error) {
        errMsg = err.message
      }
      message.error(errMsg)
    },
  })
}

export function useUpdateFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateFaqPayload }) => {
      const response = await api.patch(`/faqs/${id}`, payload)
      return response.data
    },
    onSuccess: (data) => {
      message.success(data?.message || 'FAQ updated successfully')
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
    onError: (err: unknown) => {
      let errMsg = 'Failed to update FAQ'
      if (err instanceof AxiosError && err.response?.data?.message) {
        errMsg = err.response.data.message
      } else if (err instanceof Error) {
        errMsg = err.message
      }
      message.error(errMsg)
    },
  })
}

export function useDeleteFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/faqs/${id}`)
      return response.data
    },
    onSuccess: (data) => {
      message.success(data?.message || 'FAQ deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
    onError: (err: unknown) => {
      let errMsg = 'Failed to delete FAQ'
      if (err instanceof AxiosError && err.response?.data?.message) {
        errMsg = err.response.data.message
      } else if (err instanceof Error) {
        errMsg = err.message
      }
      message.error(errMsg)
    },
  })
}
