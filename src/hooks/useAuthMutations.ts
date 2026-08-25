import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { message } from 'antd'
import { api } from '../api/axiosInstance'
import type {
  LoginCredentials,
  LoginApiResponse,
  ForgotPasswordPayload,
  VerifyEmailPayload,
  VerifyEmailResponse,
  ResendOtpPayload,
  ResetPasswordPayload,
  AuthApiResponse,
} from '../types/auth'
import { useAuthStore } from '../store/useAuthStore'

export function useLoginMutation() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation<LoginApiResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const response = await api.post<LoginApiResponse>('/auth/login', credentials)
        return response.data
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data?.message) {
          throw new Error(err.response.data.message)
        }
        if (err instanceof Error) {
          throw err
        }
        throw new Error('Login failed. Please check your credentials.')
      }
    },
    onSuccess: (data) => {
      const { token, user } = data.data
      if (token) {
        setAuth(token, user)
      }
      message.success(data.message || 'User login successfully')
    },
    onError: (error) => {
      message.error(error.message || 'Login failed. Please try again.')
    },
  })
}

export function useForgotPasswordMutation() {
  return useMutation<AuthApiResponse, Error, ForgotPasswordPayload>({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      try {
        const response = await api.post<AuthApiResponse>('/auth/forget-password', payload)
        return response.data
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data?.message) {
          throw new Error(err.response.data.message)
        }
        if (err instanceof Error) {
          throw err
        }
        throw new Error('Failed to send verification email.')
      }
    },
    onSuccess: (data) => {
      message.success(data.message || 'Verification code sent to your email')
    },
    onError: (error) => {
      message.error(error.message || 'Failed to send verification email. Please try again.')
    },
  })
}

export function useVerifyEmailMutation() {
  return useMutation<VerifyEmailResponse, Error, VerifyEmailPayload>({
    mutationFn: async (payload: VerifyEmailPayload) => {
      try {
        const response = await api.post<VerifyEmailResponse>('/auth/verify-email', payload)
        return response.data
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data?.message) {
          throw new Error(err.response.data.message)
        }
        if (err instanceof Error) {
          throw err
        }
        throw new Error('Invalid verification code.')
      }
    },
    onSuccess: (data) => {
      if (data.data) {
        localStorage.setItem('resettoken', data.data)
      }
      message.success(data.message || 'Verification successful!')
    },
    onError: (error) => {
      message.error(error.message || 'Verification failed. Please check the code.')
    },
  })
}

export function useResendOtpMutation() {
  return useMutation<AuthApiResponse, Error, ResendOtpPayload>({
    mutationFn: async (payload: ResendOtpPayload) => {
      try {
        const response = await api.post<AuthApiResponse>('/auth/resend-otp', payload)
        return response.data
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data?.message) {
          throw new Error(err.response.data.message)
        }
        if (err instanceof Error) {
          throw err
        }
        throw new Error('Failed to resend OTP.')
      }
    },
    onSuccess: (data) => {
      message.success(data.message || 'OTP resent successfully')
    },
    onError: (error) => {
      message.error(error.message || 'Failed to resend OTP. Please try again.')
    },
  })
}

export function useResetPasswordMutation() {
  return useMutation<AuthApiResponse, Error, ResetPasswordPayload>({
    mutationFn: async (payload: ResetPasswordPayload) => {
      try {
        const resetToken = localStorage.getItem('resettoken') || ''
        const response = await api.post<AuthApiResponse>(
          '/auth/reset-password',
          payload,
          {
            headers: {
              resettoken: resetToken,
            },
          }
        )
        return response.data
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data?.message) {
          throw new Error(err.response.data.message)
        }
        if (err instanceof Error) {
          throw err
        }
        throw new Error('Failed to reset password.')
      }
    },
    onSuccess: (data) => {
      localStorage.removeItem('resettoken')
      message.success(data.message || 'Password reset successfully!')
    },
    onError: (error) => {
      message.error(error.message || 'Failed to reset password. Please try again.')
    },
  })
}
