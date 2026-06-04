import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import FormField from '@/components/forms/FormField'
import { formInputClass } from '@/components/forms/formStyles'
import { getCollectionTitle } from '@/features/collection/collectionUtils'
import { getVocabularyCollectionIds, getVocabularyExample, getVocabularyMeaning, getVocabularyTerm } from '../vocabularyUtils'

const vocabularySchema = z.object({
  term: z.string().trim().min(1, 'Term is required').max(150, 'Term must be 150 characters or less'),
  meaning: z.string().trim().min(1, 'Meaning is required').max(500, 'Meaning must be 500 characters or less'),
  pronunciation: z.string().trim().max(150, 'Pronunciation is too long').optional(),
  partOfSpeech: z.string().trim().max(80, 'Part of speech is too long').optional(),
  exampleSentence: z.string().trim().max(1000, 'Example sentence is too long').optional(),
  vietnameseMeaning: z.string().trim().max(500, 'Vietnamese meaning is too long').optional(),
  note: z.string().trim().max(1000, 'Note is too long').optional(),
  collectionIds: z.array(z.string()).optional(),
})

export default function VocabularyFormDialog({ open, mode = 'create', vocabulary, collections = [], isSubmitting = false, onSubmit, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vocabularySchema),
    defaultValues: {
      term: '',
      meaning: '',
      pronunciation: '',
      partOfSpeech: '',
      exampleSentence: '',
      vietnameseMeaning: '',
      note: '',
      collectionIds: [],
    },
  })

  useEffect(() => {
    if (!open) return

    reset({
      term: vocabulary ? getVocabularyTerm(vocabulary) : '',
      meaning: vocabulary ? getVocabularyMeaning(vocabulary) : '',
      pronunciation: vocabulary?.pronunciation || '',
      partOfSpeech: vocabulary?.partOfSpeech || '',
      exampleSentence: vocabulary ? getVocabularyExample(vocabulary) : '',
      vietnameseMeaning: vocabulary?.vietnameseMeaning || '',
      note: vocabulary?.note || '',
      collectionIds: vocabulary ? getVocabularyCollectionIds(vocabulary) : [],
    })
  }, [open, reset, vocabulary])

  if (!open) return null

  const title = mode === 'edit' ? 'Edit vocabulary' : 'Create vocabulary'
  const description = mode === 'edit' ? 'Update this vocabulary entry and its collection links.' : 'Add a word or phrase for review, flashcards, and future practice modes.'

  const submit = (values) => {
    onSubmit({
      term: values.term.trim(),
      meaning: values.meaning.trim(),
      pronunciation: values.pronunciation?.trim() || '',
      partOfSpeech: values.partOfSpeech?.trim() || '',
      exampleSentence: values.exampleSentence?.trim() || '',
      vietnameseMeaning: values.vietnameseMeaning?.trim() || '',
      note: values.note?.trim() || '',
      collectionIds: values.collectionIds || [],
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
      <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-dialog border border-border bg-card p-6 text-card-foreground shadow-xl" role="dialog" aria-modal="true" aria-labelledby="vocabulary-form-title">
        <div>
          <h2 id="vocabulary-form-title" className="text-2xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField id="vocabulary-term" label="Term" error={errors.term?.message}>
              <input id="vocabulary-term" disabled={isSubmitting} className={formInputClass(Boolean(errors.term))} placeholder="abandon" aria-invalid={Boolean(errors.term)} {...register('term')} />
            </FormField>

            <FormField id="vocabulary-pronunciation" label="Pronunciation" error={errors.pronunciation?.message}>
              <input id="vocabulary-pronunciation" disabled={isSubmitting} className={formInputClass(Boolean(errors.pronunciation))} placeholder="/?'bænd?n/" aria-invalid={Boolean(errors.pronunciation)} {...register('pronunciation')} />
            </FormField>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField id="vocabulary-meaning" label="Meaning" error={errors.meaning?.message}>
              <input id="vocabulary-meaning" disabled={isSubmitting} className={formInputClass(Boolean(errors.meaning))} placeholder="to leave behind" aria-invalid={Boolean(errors.meaning)} {...register('meaning')} />
            </FormField>

            <FormField id="vocabulary-vietnamese" label="Vietnamese meaning" error={errors.vietnameseMeaning?.message}>
              <input id="vocabulary-vietnamese" disabled={isSubmitting} className={formInputClass(Boolean(errors.vietnameseMeaning))} placeholder="t? b?" aria-invalid={Boolean(errors.vietnameseMeaning)} {...register('vietnameseMeaning')} />
            </FormField>
          </div>

          <FormField id="vocabulary-pos" label="Part of speech" error={errors.partOfSpeech?.message}>
            <input id="vocabulary-pos" disabled={isSubmitting} className={formInputClass(Boolean(errors.partOfSpeech))} placeholder="verb, noun, adjective..." aria-invalid={Boolean(errors.partOfSpeech)} {...register('partOfSpeech')} />
          </FormField>

          <FormField id="vocabulary-example" label="Example sentence" error={errors.exampleSentence?.message}>
            <textarea id="vocabulary-example" disabled={isSubmitting} className="min-h-24 w-full rounded-button border border-input bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60" placeholder="She had to abandon the project." aria-invalid={Boolean(errors.exampleSentence)} {...register('exampleSentence')} />
          </FormField>

          <FormField id="vocabulary-note" label="Note" error={errors.note?.message} hint="Optional memory tip, synonym, or usage note.">
            <textarea id="vocabulary-note" disabled={isSubmitting} className="min-h-24 w-full rounded-button border border-input bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60" placeholder="Often used in formal contexts." aria-invalid={Boolean(errors.note)} {...register('note')} />
          </FormField>

          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-sm font-semibold text-foreground">Collections</p>
            <p className="mt-1 text-sm text-muted-foreground">Optional. Link this vocabulary to one or more collections.</p>
            {collections.length ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {collections.map((collection) => (
                  <label key={collection.id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 text-sm">
                    <input type="checkbox" value={String(collection.id)} disabled={isSubmitting} className="h-4 w-4 accent-primary" {...register('collectionIds')} />
                    <span className="truncate">{getCollectionTitle(collection)}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No collections available yet.</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save vocabulary'}</Button>
          </div>
        </form>
      </section>
    </div>
  )
}
