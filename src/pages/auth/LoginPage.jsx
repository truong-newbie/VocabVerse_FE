import { Link, useLocation, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import FormField from '@/components/forms/FormField'
import { formInputClass } from '@/components/forms/formStyles'
import { useLogin } from '@/features/auth/useAuthActions'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()
  const from = location.state?.from?.pathname
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      const user = await login.mutateAsync(values)
      const role = String(user?.role || '').toUpperCase()
      const targetPath = role === 'ADMIN'
        ? (from?.startsWith('/admin') ? from : '/admin/dashboard')
        : (from && !from.startsWith('/admin') ? from : '/dashboard')

      toast.success('Welcome back to VocabVerse')
      navigate(targetPath, { replace: true })
    } catch (error) {
      toast.error(error.message || 'Unable to log in')
    }
  }

  const isLoading = isSubmitting || login.isPending

  return (
    <div className="mx-auto flex min-h-full max-w-xl flex-col justify-center py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Sign in</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">Continue your vocabulary streak</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Use your VocabVerse account to access collections, reviews, flashcards, and speaking practice.</p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField id="email" label="Email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isLoading}
            className={formInputClass(Boolean(errors.email))}
            placeholder="learner@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        <FormField id="password" label="Password" error={errors.password?.message}>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            disabled={isLoading}
            className={formInputClass(Boolean(errors.password))}
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>

        <div className="rounded-2xl border border-border bg-muted/60 p-4 text-sm leading-6 text-muted-foreground">
          Tokens are stored only in local auth state/local storage for the session foundation. They are never placed in URLs.
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to VocabVerse? <Link className="font-semibold text-primary" to="/register">Create an account</Link>
      </p>
    </div>
  )
}

