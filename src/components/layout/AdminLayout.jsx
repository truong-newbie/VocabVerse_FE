import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminContent from '@/components/admin/AdminContent'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_95%_12%,rgba(20,184,166,0.14),transparent_28%)]" />
      <AdminSidebar />
      <div className="relative min-h-screen lg:pl-72">
        <AdminHeader />
        <AdminContent>
          <Outlet />
        </AdminContent>
      </div>
    </div>
  )
}
