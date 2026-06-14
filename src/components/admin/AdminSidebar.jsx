import { NavLink } from 'react-router-dom'
import { FiActivity, FiBell, FiDatabase, FiGrid, FiLayers, FiShield, FiUsers, FiVideo } from 'react-icons/fi'
import { cn } from '@/utils/cn'

const adminNavigation = [
  { label: 'Overview', to: '/admin/dashboard', icon: FiGrid },
  { label: 'Users', to: '/admin/users', icon: FiUsers },
  { label: 'Collections', to: '/admin/collections', icon: FiLayers },
  { label: 'Public Collections', to: '/admin/public-collections', icon: FiShield },
  { label: 'Shadowing', to: '/admin/shadowing', icon: FiVideo },
  { label: 'Notifications', to: '/admin/notifications', icon: FiBell },
  { label: 'System Health', to: '/admin/system', icon: FiActivity },
]

export default function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-[#0b0f19]/96 px-4 py-5 shadow-2xl shadow-black/30 backdrop-blur-xl lg:block">
      <NavLink to="/admin" className="flex items-center gap-3 px-2">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-sm font-black text-slate-950">AD</span>
        <div>
          <p className="text-lg font-bold leading-none tracking-tight">Admin Portal</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-500">VocabVerse Ops</p>
        </div>
      </NavLink>

      <nav className="mt-9 space-y-1" aria-label="Admin navigation">
        {adminNavigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition',
                isActive
                  ? 'border border-cyan-300/25 bg-cyan-300/15 text-cyan-100 shadow-lg shadow-cyan-950/30'
                  : 'border border-transparent text-slate-400 hover:border-blue-300/20 hover:bg-blue-400/10 hover:text-blue-100',
              )
            }
          >
            <item.icon aria-hidden="true" className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute inset-x-4 bottom-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <FiDatabase className="h-5 w-5 text-emerald-300" aria-hidden="true" />
        <p className="mt-3 text-sm font-semibold">Admin boundary</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">Routes and actions are available only to ADMIN role accounts.</p>
      </div>
    </aside>
  )
}
