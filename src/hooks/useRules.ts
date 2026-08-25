import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { AxiosError } from 'axios'
import { api } from '../api/axiosInstance'
import type { CreateOrUpdateRulePayload, RuleResponse, RuleType } from '../types/rules'

export function useGetRule(type: RuleType) {
  const endpointType = type.toLowerCase()
  return useQuery({
    queryKey: ['rules', endpointType],
    queryFn: async () => {
      try {
        const response = await api.get<RuleResponse>(`/rules/${endpointType}`)
        return response.data.data
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return { content: '' }
        }
        throw error
      }
    },
  })
}

export function useSaveRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateOrUpdateRulePayload) => {
      const response = await api.post<RuleResponse>('/rules', payload)
      return response.data
    },
    onSuccess: (data, variables) => {
      message.success(data?.message || 'Content saved successfully')
      queryClient.invalidateQueries({ queryKey: ['rules', variables.type.toLowerCase()] })
    },
    onError: (err: unknown) => {
      let errMsg = 'Failed to save content'
      if (err instanceof AxiosError && err.response?.data?.message) {
        errMsg = err.response.data.message
      } else if (err instanceof Error) {
        errMsg = err.message
      }
      message.error(errMsg)
    },
  })
}
