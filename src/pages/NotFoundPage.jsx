import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiHome, FiSearch } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/app/store/authStore'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const primaryTarget = isAuthenticated ? '/dashboard' : '/login'

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full max-w-2xl rounded-[28px] border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <FiSearch aria-hidden="true" className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary">404</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Page not found</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          This route does not exist in VocabVerse. Return to the learning workspace or sign in to continue.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => navigate(primaryTarget)}>
            <FiHome aria-hidden="true" /> {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/public/collections')}>
            <FiArrowLeft aria-hidden="true" /> Browse Public Library
          </Button>
        </div>
      </section>
    </main>
  )
}
