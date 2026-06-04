import { cn } from '../../utils/cn'

export default function ResponsiveContentContainer({ children, className }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8', className)}>{children}</div>
}
