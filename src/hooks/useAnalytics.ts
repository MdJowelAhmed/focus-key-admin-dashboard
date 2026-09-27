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

export function useFocusTimeOverTime({
  year,
  days,
}: {
  year?: number
  days?: number
} = {}) {
  return useQuery({
    queryKey: ['analytics', 'focus-time-over-time', year, days],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (year !== undefined) {
        params.append('year', String(year))
        params.append('years', String(year))
      }
      if (days !== undefined) {
        params.append('days', String(days))
      }

      const queryString = params.toString()
      const url = `/analytics/focus-time-over-time${queryString ? `?${queryString}` : ''}`

      const response = await api.get<FocusTimeOverTimeResponse>(url)
      return response.data.data
    },
  })
}
