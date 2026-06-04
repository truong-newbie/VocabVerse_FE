import { cn } from '@/utils/cn'

export function formInputClass(hasError = false) {
  return cn(
    'h-12 w-full rounded-button border bg-background px-4 text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60',
    hasError ? 'border-destructive focus:border-destructive' : 'border-input focus:border-ring',
  )
}
