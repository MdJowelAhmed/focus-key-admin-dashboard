export interface AnalyticsStats {
  totalUsers: number
  activatedUsers: number
  sevenDayActiveUsers: number
  totalFocusSessionsThisWeek: number
  totalBreaksTaken: number
  cooldownCompleted: number
  usersWithPartners: number
  jointSessions: number
  totalLocks: number
  totalUnlocks: number
}

export interface AnalyticsStatsResponse {
  success: boolean
  message: string
  data: AnalyticsStats
}

export interface FocusTimeOverTimeItem {
  date: string
  focusMinutes: number
}

export interface FocusTimeOverTimeData {
  year: number
  days: number
  focusTimeOverTime: FocusTimeOverTimeItem[]
}

export interface FocusTimeOverTimeResponse {
  success: boolean
  message: string
  data: FocusTimeOverTimeData
}
