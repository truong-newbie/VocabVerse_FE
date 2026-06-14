import { cn } from '@/utils/cn'

export default function AdminContent({ children, className }) {
  return <main className={cn('px-4 py-8 sm:px-6 lg:px-8', className)}>{children}</main>
}
