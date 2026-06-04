import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import FormField from '@/components/forms/FormField'
import { formInputClass } from '@/components/forms/formStyles'
import { getCollectionTitle } from '../collectionUtils'

const collectionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(150, 'Title must be 150 characters or less'),
  description: z.string().trim().max(500, 'Description must be 500 characters or less').optional(),
  visibility: z.enum(['PRIVATE', 'PUBLIC']),
})

export default function CollectionFormDialog({ open, mode = 'create', collection, isSubmitting = false, onSubmit, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: '',
      description: '',
      visibility: 'PRIVATE',
    },
  })

  useEffect(() => {
    if (!open) return

    reset({
      title: collection ? getCollectionTitle(collection) : '',
      description: collection?.description || '',
      visibility: collection?.visibility === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE',
    })
  }, [collection, open, reset])

  if (!open) return null

  const title = mode === 'edit' ? 'Edit collection' : 'Create collection'
  const description = mode === 'edit' ? 'Update collection details without changing vocabulary data.' : 'Create a focused set for words you want to study together.'

  const submit = (values) => {
    onSubmit({
      title: values.title.trim(),
      description: values.description?.trim() || '',
      visibility: values.visibility,
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
      <section className="w-full max-w-xl rounded-dialog border border-border bg-card p-6 text-card-foreground shadow-xl" role="dialog" aria-modal="true" aria-labelledby="collection-form-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="collection-form-title" className="text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(submit)} noValidate>
          <FormField id="collection-title" label="Title" error={errors.title?.message}>
            <input
              id="collection-title"
              disabled={isSubmitting}
              className={formInputClass(Boolean(errors.title))}
              placeholder="TOEIC 600 Words"
              aria-invalid={Boolean(errors.title)}
              {...register('title')}
            />
          </FormField>

          <FormField id="collection-description" label="Description" error={errors.description?.message} hint="Optional. Add a goal, exam, or context for this set.">
            <textarea
              id="collection-description"
              disabled={isSubmitting}
              className="min-h-28 w-full rounded-button border border-input bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Words for daily review and quiz practice."
              aria-invalid={Boolean(errors.description)}
              {...register('description')}
            />
          </FormField>

          <FormField id="collection-visibility" label="Visibility" error={errors.visibility?.message} hint="SYSTEM collections are managed by the backend and cannot be selected here.">
            <select
              id="collection-visibility"
              disabled={isSubmitting}
              className={formInputClass(Boolean(errors.visibility))}
              aria-invalid={Boolean(errors.visibility)}
              {...register('visibility')}
            >
              <option value="PRIVATE">PRIVATE</option>
              <option value="PUBLIC">PUBLIC</option>
            </select>
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save collection'}</Button>
          </div>
        </form>
      </section>
    </div>
  )
}

