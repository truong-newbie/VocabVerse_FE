import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'
import AppSidebar from './AppSidebar'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      {mobileOpen ? <button className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden" aria-label="Close navigation" onClick={() => setMobileOpen(false)} /> : null}
      <div className="lg:pl-72">
        <AppHeader mobileOpen={mobileOpen} onToggleMobile={() => setMobileOpen((value) => !value)} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
