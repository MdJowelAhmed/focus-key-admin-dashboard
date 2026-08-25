import { useState, useRef, useEffect, type FormEvent, type ChangeEvent, type KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import AuthCard from '../../components/auth/AuthCard'
import PrimaryButton from '../../components/auth/PrimaryButton'
import BackToLoginLink from '../../components/auth/BackToLoginLink'
import { useVerifyEmailMutation, useResendOtpMutation } from '../../hooks/useAuthMutations'

type LocationState = { email?: string } | null

export default function CheckEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState
  const email = state?.email ?? ''

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [timer, setTimer] = useState<number>(60)
  const [canResend, setCanResend] = useState<boolean>(false)

  const verifyEmailMutation = useVerifyEmailMutation()
  const resendOtpMutation = useResendOtpMutation()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [timer])

  const handleOtpChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/[^0-9]/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.slice(0, 6).split('')
    const newOtp = [...otp]
    digits.forEach((digit, i) => {
      newOtp[i] = digit
    })
    setOtp(newOtp)
    const focusIndex = Math.min(digits.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) return

    verifyEmailMutation.mutate(
      {
        email,
        oneTimeCode: Number(code),
      },
      {
        onSuccess: () => {
          navigate('/reset-password')
        },
      }
    )
  }

  const handleResend = () => {
    if (!email || !canResend || resendOtpMutation.isPending) return

    resendOtpMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setTimer(60)
          setCanResend(false)
        },
      }
    )
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Check your email"
        description={
          <span>
            We sent a 6-digit verification code to{' '}
            <strong className="text-white font-medium">{email || 'your email'}</strong>
          </span>
        }
        bordered
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-12 w-11 sm:w-12 rounded-lg border border-surface-border bg-surface-elevated text-center text-xl font-bold text-white shadow-sm transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-ring"
                required
              />
            ))}
          </div>

          <PrimaryButton
            type="submit"
            disabled={otp.join('').length < 6 || verifyEmailMutation.isPending}
          >
            {verifyEmailMutation.isPending ? 'Verifying...' : 'Verify Code'}
          </PrimaryButton>
        </form>

        <p className="mt-5 text-center text-sm text-gray-400">
          Didn't receive the code?{' '}
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendOtpMutation.isPending}
              className="font-medium text-brand hover:underline disabled:opacity-50"
            >
              {resendOtpMutation.isPending ? 'Resending...' : 'Click to resend'}
            </button>
          ) : (
            <span className="font-medium text-gray-500">
              Resend in {timer}s
            </span>
          )}
        </p>

        <BackToLoginLink />
      </AuthCard>
    </AuthLayout>
  )
}
