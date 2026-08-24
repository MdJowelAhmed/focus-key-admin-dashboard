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

export interface UserAnalyticsItem {
  userId: string
  name: string
  email: string
  role: string
  profileImage?: string
  isPaired: boolean
  status: 'ACTIVE' | 'INACTIVE' | string
  totalSessions: number
  totalLocks: number
  totalUnlocks: number
  totalFocusTime: number
  breakCount: number
  registeredAt: string
  lastActiveAt: string
}

export interface UserAnalyticsMeta {
  page: number
  limit: number
  total: number
  totalPage: number
}

export interface UserAnalyticsResponse {
  success: boolean
  message: string
  data: UserAnalyticsItem[]
  meta: UserAnalyticsMeta
}

export interface UpdateUserStatusPayload {
  status: 'ACTIVE' | 'INACTIVE' | string
}
