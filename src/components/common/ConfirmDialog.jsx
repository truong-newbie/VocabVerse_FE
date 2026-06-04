import Button from '../ui/Button'

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, destructive = false, isSubmitting = false }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
      <section className="w-full max-w-md rounded-dialog border border-border bg-card p-6 text-card-foreground shadow-xl" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <h2 id="confirm-dialog-title" className="text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>{cancelLabel}</Button>
          <Button variant={destructive ? 'destructive' : 'primary'} onClick={onConfirm} disabled={isSubmitting}>{isSubmitting ? 'Working...' : confirmLabel}</Button>
        </div>
      </section>
    </div>
  )
}
