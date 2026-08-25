import type { User } from './auth'

export interface ProfileResponse {
  success: boolean
  message: string
  data: User
}

export interface UpdateProfilePayload {
  name: string
  email?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordResponse {
  success: boolean
  message: string
}
