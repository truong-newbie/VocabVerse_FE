import { NavLink } from 'react-router-dom'
import {
  FiBookOpen,
  FiGlobe,
  FiGrid,
  FiLayers,
  FiMessageCircle,
  FiMic,
  FiPenTool,
  FiRepeat,
  FiSearch,
  FiTarget,
  FiZap,
} from 'react-icons/fi'
import { cn } from '../../utils/cn'

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: FiGrid },
  { label: 'Collections', to: '/collections', icon: FiLayers },
  { label: 'Public Library', to: '/public/collections', icon: FiGlobe },
  { label: 'Vocabulary', to: '/vocabularies', icon: FiBookOpen },
  { label: 'Review Today', to: '/review', icon: FiRepeat },
  { label: 'Flashcards', to: '/flashcards', icon: FiZap },
  { label: 'Quiz', to: '/quiz', icon: FiTarget },
  { label: 'Typing', to: '/typing', icon: FiPenTool },
  { label: 'AI Coach', to: '/ai', icon: FiSearch },
  { label: 'Shadowing', to: '/shadowing', icon: FiMic },
  { label: 'Roleplay', to: '/roleplay', icon: FiMessageCircle },
]

export default function AppSidebar({ mobileOpen = false, onNavigate }) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-card/92 px-4 py-5 shadow-sm backdrop-blur-xl transition-transform lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex h-full flex-col">
        <NavLink to="/dashboard" className="flex items-center gap-3 px-2" onClick={onNavigate}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-sm font-black text-primary-foreground shadow-sm">VV</span>
          <div>
            <p className="text-lg font-bold leading-none">VocabVerse</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">Learn with rhythm</p>
          </div>
        </NavLink>

        <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-button px-3 py-3 text-sm font-semibold transition',
                  isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <item.icon aria-hidden="true" className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="rounded-card border border-border bg-muted p-4">
          <p className="text-sm font-semibold text-foreground">Daily focus</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Review 25 words, then complete one short quiz to keep your streak.</p>
        </div>
      </div>
    </aside>
  )
}
