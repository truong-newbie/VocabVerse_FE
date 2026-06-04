import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import FormField from '@/components/forms/FormField'
import { formInputClass } from '@/components/forms/formStyles'
import { useRegister } from '@/features/auth/useAuthActions'

const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(120, 'Full name is too long'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export default function RegisterPage() {
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values) => {
    const payload = { fullName: values.fullName, email: values.email, password: values.password }
    try {
      const currentUser = await registerMutation.mutateAsync(payload)

      if (currentUser) {
        toast.success('Account created. Welcome to VocabVerse')
        navigate('/dashboard', { replace: true })
        return
      }

      toast.success('Account created. Please log in.')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Unable to register')
    }
  }

  const isLoading = isSubmitting || registerMutation.isPending

  return (
    <div className="mx-auto flex min-h-full max-w-xl flex-col justify-center py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Create account</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">Start building your word bank</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Set up a learning workspace for vocabulary collections, spaced reviews, and practice sessions.</p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField id="fullName" label="Full name" error={errors.fullName?.message}>
          <input
            id="fullName"
            autoComplete="name"
            disabled={isLoading}
            className={formInputClass(Boolean(errors.fullName))}
            placeholder="Alex Nguyen"
            aria-invalid={Boolean(errors.fullName)}
            {...register('fullName')}
          />
        </FormField>

        <FormField id="email" label="Email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isLoading}
            className={formInputClass(Boolean(errors.email))}
            placeholder="alex@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        <FormField id="password" label="Password" error={errors.password?.message} hint="Use at least 8 characters.">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
            className={formInputClass(Boolean(errors.password))}
            placeholder="Create a strong password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>

        <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
            className={formInputClass(Boolean(errors.confirmPassword))}
            placeholder="Repeat your password"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
        </FormField>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link className="font-semibold text-primary" to="/login">Log in</Link>
      </p>
    </div>
  )
}

