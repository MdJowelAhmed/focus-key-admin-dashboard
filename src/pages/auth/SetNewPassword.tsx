import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import AuthCard from '../../components/auth/AuthCard'
import PasswordField from '../../components/auth/PasswordField'
import PrimaryButton from '../../components/auth/PrimaryButton'
import BackToLoginLink from '../../components/auth/BackToLoginLink'
import { useResetPasswordMutation } from '../../hooks/useAuthMutations'

const MIN_LENGTH = 6

export default function SetNewPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  const resetPasswordMutation = useResetPasswordMutation()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (password.length < MIN_LENGTH) {
      setError(`Password must be at least ${MIN_LENGTH} characters.`)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError(null)

    resetPasswordMutation.mutate(
      {
        newPassword: password,
        confirmPassword: confirm,
      },
      {
        onSuccess: () => {
          navigate('/password-reset-success')
        },
      }
    )
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Set new password"
        description="Your new password must be different to previously used passwords."
        bordered
      >
        <form onSubmit={onSubmit} className="space-y-5">
          <PasswordField
            label="New Password"
            name="newPassword"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            hint={`Must be at least ${MIN_LENGTH} characters.`}
            required
          />
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            autoComplete="new-password"
            value={confirm}
            onChange={setConfirm}
            required
          />

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <PrimaryButton
            type="submit"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset password'}
          </PrimaryButton>
        </form>
        <BackToLoginLink />
      </AuthCard>
    </AuthLayout>
  )
}
