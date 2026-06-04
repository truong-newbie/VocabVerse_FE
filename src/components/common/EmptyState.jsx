import Button from '../ui/Button'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <section className="rounded-card border border-dashed border-border bg-card/75 p-8 text-center shadow-sm">
      {Icon ? (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="h-7 w-7" />
        </div>
      ) : null}
      <h2 className="mt-5 text-2xl font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  )
}

export function EmptyStateAction({ children, ...props }) {
  return <Button {...props}>{children}</Button>
}
