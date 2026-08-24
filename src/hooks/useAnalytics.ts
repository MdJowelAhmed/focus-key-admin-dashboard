import { useQuery } from '@tanstack/react-query'
import { api } from '../api/axiosInstance'
import type { AnalyticsStatsResponse, FocusTimeOverTimeResponse } from '../types/analytics'

export function useAnalyticsStats() {
  return useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: async () => {
      const response = await api.get<AnalyticsStatsResponse>('/analytics/stats')
      return response.data.data
    },
  })
}

export function useFocusTimeOverTime() {
  return useQuery({
    queryKey: ['analytics', 'focus-time-over-time'],
    queryFn: async () => {
      const response = await api.get<FocusTimeOverTimeResponse>('/analytics/focus-time-over-time')
      return response.data.data
    },
  })
}
