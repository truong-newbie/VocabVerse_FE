import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'sonner'
import Button from '../../components/ui/Button'
import { useLogin } from '../../features/auth/useAuthActions'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()
  const [form, setForm] = useState({ username: '', password: '' })
  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await login.mutateAsync(form)
      toast.success('Welcome back')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to log in')
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-xl flex-col justify-center py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Sign in</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">Continue your vocabulary streak</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Use your VocabVerse account to access collections, reviews, flashcards, and speaking practice.</p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="username">Username or email</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="mt-2 h-12 w-full rounded-button border border-input bg-background px-4 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            placeholder="learner@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-2 h-12 w-full rounded-button border border-input bg-background px-4 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            placeholder="Enter your password"
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={login.isPending}>
          {login.isPending ? 'Signing in...' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to VocabVerse? <Link className="font-semibold text-primary" to="/register">Create an account</Link>
      </p>
    </div>
  )
}
