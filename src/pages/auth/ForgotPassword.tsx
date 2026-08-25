import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import AuthCard from '../../components/auth/AuthCard'
import AuthIllustration from '../../components/auth/AuthIllustration'
import FormField from '../../components/auth/FormField'
import PrimaryButton from '../../components/auth/PrimaryButton'
import BackToLoginLink from '../../components/auth/BackToLoginLink'
import { useForgotPasswordMutation } from '../../hooks/useAuthMutations'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const forgotPasswordMutation = useForgotPasswordMutation()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email) return

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          navigate('/check-email', { state: { email } })
        },
      }
    )
  }

  return (
    <AuthLayout
      illustration={<AuthIllustration alt="Forgot password illustration" />}
    >
      <AuthCard
        title="Forgot password?"
        description="No worries, we'll send you reset instructions."
        bordered
      >
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PrimaryButton
            type="submit"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? 'Sending...' : 'Submit'}
          </PrimaryButton>
        </form>
        <BackToLoginLink />
      </AuthCard>
    </AuthLayout>
  )
}
