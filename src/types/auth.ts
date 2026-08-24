export interface UserLocation {
  type: string
  address: string
}

export interface User {
  _id: string
  name: string
  role: string
  email: string
  verified: boolean
  status: string
  profileImage?: string
  lastLoginAt?: string
  isPaired?: boolean
  pairingCode?: string | null
  dateOfBirth?: string | null
  agencyLogo?: string
  isSubscribed?: boolean
  hasAccess?: boolean
  isAgentVerified?: boolean
  maxListings?: number
  remainingListings?: number
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
  location?: UserLocation
  installedApps?: unknown[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponseData {
  token: string
  user: User
}

export interface LoginApiResponse {
  success: boolean
  message: string
  data: LoginResponseData
}
