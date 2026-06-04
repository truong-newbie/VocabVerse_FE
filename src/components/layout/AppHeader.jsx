import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FiLogOut, FiMenu, FiMoon, FiSearch, FiSun, FiX } from 'react-icons/fi'
import { useAuthStore } from '@/app/store/authStore'
import { useThemeStore } from '@/app/store/themeStore'
import { useLogout } from '@/features/auth/useAuthActions'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import Button from '../ui/Button'

export default function AppHeader({ mobileOpen, onToggleMobile }) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const logoutMutation = useLogout()
  const [query, setQuery] = useState('')

  const currentUserQuery = useCurrentUser()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      toast.success('Signed out')
    } catch (error) {
      toast.error(error.message || 'Signed out locally')
    } finally {
      navigate('/login', { replace: true })
    }
  }

  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  const displayName = user?.fullName || user?.displayName || user?.username || user?.email || 'Learner'
  const subtitle = currentUserQuery.isLoading ? 'Loading profile...' : user?.email || 'Vocabulary path'

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/82 backdrop-blur-xl">
      <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" className="h-10 w-10 px-0 lg:hidden" onClick={onToggleMobile} aria-label="Toggle navigation">
          {mobileOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </Button>

        <div className="hidden flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2 shadow-sm md:flex">
          <FiSearch aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
          <input
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search collections, words, or practice modes..."
            aria-label="Search learning content"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" className="hidden sm:inline-flex" onClick={() => navigate('/review')}>Review due</Button>
          <Button variant="ghost" className="h-10 w-10 px-0" onClick={() => setTheme(nextTheme)} aria-label="Toggle dark mode">
            {theme === 'dark' ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </Button>
          <div className="hidden items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 shadow-sm sm:flex">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
            <div className="max-w-40">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <Button variant="ghost" className="h-10 w-10 px-0" onClick={handleLogout} aria-label="Log out" disabled={logoutMutation.isPending}>
            <FiLogOut aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}
