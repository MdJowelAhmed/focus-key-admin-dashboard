import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import AuthCard from '../../components/auth/AuthCard'
import AuthIllustration from '../../components/auth/AuthIllustration'
import FormField from '../../components/auth/FormField'
import PasswordField from '../../components/auth/PasswordField'
import PrimaryButton from '../../components/auth/PrimaryButton'
import { useLoginMutation } from '../../hooks/useAuthMutations'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate: login, isPending, error, reset } = useLoginMutation()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    login(
      { email, password },
      {
        onSuccess: () => {
          navigate('/dashboard')
        },
      }
    )
  }

  return (
    <AuthLayout
      illustration={<AuthIllustration alt="User login illustration" />}
    >
      <AuthCard description="Welcome back! Please enter your details.">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error.message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <FormField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) reset()
            }}
            required
          />

          <div>
            <PasswordField
              label="Password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(val) => {
                setPassword(val)
                if (error) reset()
              }}
              placeholder="Enter your password"
            />
            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-brand hover:underline"
              >
                Forgot password
              </Link>
            </div>
          </div>

          <PrimaryButton type="submit" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </PrimaryButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
