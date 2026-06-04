import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'sonner'
import Button from '../../components/ui/Button'
import { useRegister } from '../../features/auth/useAuthActions'

export default function RegisterPage() {
  const navigate = useNavigate()
  const register = useRegister()
  const [form, setForm] = useState({ username: '', email: '', fullName: '', password: '' })

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await register.mutateAsync(form)
      toast.success('Account created. Please log in.')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to register')
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-xl flex-col justify-center py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Create account</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">Start building your word bank</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Set up a learning workspace for vocabulary collections, spaced reviews, and practice sessions.</p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="fullName">Full name</label>
          <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required className="mt-2 h-12 w-full rounded-button border border-input bg-background px-4 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" placeholder="Alex Nguyen" />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="username">Username</label>
          <input id="username" name="username" value={form.username} onChange={handleChange} required className="mt-2 h-12 w-full rounded-button border border-input bg-background px-4 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" placeholder="alexlearns" />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="mt-2 h-12 w-full rounded-button border border-input bg-background px-4 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" placeholder="alex@example.com" />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="mt-2 h-12 w-full rounded-button border border-input bg-background px-4 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" placeholder="Create a strong password" />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={register.isPending}>
          {register.isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link className="font-semibold text-primary" to="/login">Log in</Link>
      </p>
    </div>
  )
}
