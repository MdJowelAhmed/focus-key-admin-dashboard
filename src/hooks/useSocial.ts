import { useQuery } from '@tanstack/react-query'
import { api } from '../api/axiosInstance'
import type {
  EngagementStatsResponse,
  FocusTimeTogetherResponse,
  RecentActivityResponse,
} from '../types/analytics'

export function useEngagementStats() {
  return useQuery({
    queryKey: ['analytics', 'engagement-stats'],
    queryFn: async () => {
      const response = await api.get<EngagementStatsResponse>('/analytics/engagement-stats')
      return response.data.data
    },
  })
}

export function useFocusTimeTogetherOverTime({
  year,
  days,
}: {
  year?: number
  days?: number
} = {}) {
  return useQuery({
    queryKey: ['analytics', 'focus-time-together-over-time', year, days],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (year !== undefined) params.append('year', String(year))
      if (days !== undefined) params.append('days', String(days))

      const queryString = params.toString()
      const url = `/analytics/focus-time-together-over-time${queryString ? `?${queryString}` : ''}`

      const response = await api.get<FocusTimeTogetherResponse>(url)
      return response.data.data
    },
  })
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: async () => {
      const response = await api.get<RecentActivityResponse>('/dashboard/recent-activity')
      return response.data.data
    },
  })
}
