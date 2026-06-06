import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FiArrowLeft, FiLogOut, FiShield } from 'react-icons/fi'
import { useAuthStore } from '@/app/store/authStore'
import { useLogout } from '@/features/auth/useAuthActions'
import Button from '@/components/ui/Button'

export default function AdminHeader() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logoutMutation = useLogout()
  const displayName = user?.fullName || user?.displayName || user?.username || user?.email || 'Admin'

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

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080b12]/86 backdrop-blur-xl">
      <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" className="border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => navigate('/dashboard')}>
          <FiArrowLeft aria-hidden="true" /> Learner app
        </Button>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 sm:flex">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{displayName}</p>
              <p className="flex items-center gap-1 text-xs font-medium text-cyan-200"><FiShield aria-hidden="true" /> ADMIN</p>
            </div>
          </div>
          <Button variant="ghost" className="border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10 hover:text-white" onClick={handleLogout} disabled={logoutMutation.isPending}>
            <FiLogOut aria-hidden="true" /> Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}
