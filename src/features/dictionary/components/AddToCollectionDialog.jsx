import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import { getCollectionTitle } from '@/features/collection/collectionUtils'

export default function AddToCollectionDialog({ open, collections, isSubmitting, onSubmit, onClose }) {
  const [collectionId, setCollectionId] = useState('')

  if (!open) return null

  const submit = (event) => {
    event.preventDefault()
    if (!collectionId) return
    onSubmit(collectionId)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
      <section className="w-full max-w-xl rounded-dialog border border-border bg-card p-6 text-card-foreground shadow-xl" role="dialog" aria-modal="true" aria-labelledby="dictionary-collection-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="dictionary-collection-title" className="text-2xl font-semibold">Add to collection</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Select a collection to save this dictionary word for review later.</p>
          </div>
          <Button variant="ghost" className="h-10 w-10 px-0" onClick={onClose} aria-label="Close add to collection">
            <FiX aria-hidden="true" />
          </Button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={submit}>
          <label className="block">
            <span className="text-sm font-semibold text-foreground">Collection</span>
            <select
              className="mt-2 h-12 w-full rounded-button border border-input bg-background px-4 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
              value={collectionId}
              onChange={(event) => setCollectionId(event.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Select collection...</option>
              {collections.map((collection) => (
                <option key={collection.id} value={String(collection.id)}>{getCollectionTitle(collection)}</option>
              ))}
            </select>
          </label>

          {!collections.length ? <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">No collections available yet. Create a collection first, then return to Dictionary.</p> : null}

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={!collectionId || isSubmitting}>{isSubmitting ? 'Saving...' : 'Save to collection'}</Button>
          </div>
        </form>
      </section>
    </div>
  )
}
