import { FiBookOpen, FiCalendar, FiEdit3, FiEye, FiTrash2 } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatVocabularyDate, getVocabularyCollections, getVocabularyExample, getVocabularyMeaning, getVocabularyTerm } from '../vocabularyUtils'

export default function VocabularyCard({ vocabulary, onOpen, onEdit, onDelete }) {
  const term = getVocabularyTerm(vocabulary)
  const meaning = getVocabularyMeaning(vocabulary)
  const example = getVocabularyExample(vocabulary)
  const collections = getVocabularyCollections(vocabulary)
  const updatedDate = vocabulary.updatedAt || vocabulary.createdAt

  return (
    <article className="flex h-full flex-col rounded-card border border-border bg-card p-5 text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Badge variant="primary">{vocabulary.partOfSpeech || 'Word'}</Badge>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {collections.length} collections
        </span>
      </div>

      <div className="mt-5 flex-1">
        <h2 className="line-clamp-2 text-2xl font-bold tracking-tight">{term}</h2>
        {vocabulary.pronunciation ? <p className="mt-1 text-sm font-medium text-primary">{vocabulary.pronunciation}</p> : null}
        <p className="mt-3 line-clamp-2 text-base font-semibold text-foreground">{meaning}</p>
        {vocabulary.vietnameseMeaning ? <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">VI: {vocabulary.vietnameseMeaning}</p> : null}
        {example ? <p className="mt-4 line-clamp-3 rounded-2xl bg-muted p-3 text-sm leading-6 text-muted-foreground">{example}</p> : null}
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        <FiCalendar aria-hidden="true" className="h-4 w-4" />
        <span>Updated {formatVocabularyDate(updatedDate)}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {collections.slice(0, 3).map((collection) => (
          <Badge key={collection.id} variant="secondary">{collection.title || collection.name || `Collection ${collection.id}`}</Badge>
        ))}
        {collections.length > 3 ? <Badge variant="muted">+{collections.length - 3}</Badge> : null}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <Button variant="secondary" onClick={() => onOpen(vocabulary)} aria-label={`Open ${term}`}>
          <FiEye aria-hidden="true" /> Open
        </Button>
        <Button variant="outline" onClick={() => onEdit(vocabulary)} aria-label={`Edit ${term}`}>
          <FiEdit3 aria-hidden="true" /> Edit
        </Button>
        <Button variant="outline" onClick={() => onDelete(vocabulary)} aria-label={`Delete ${term}`}>
          <FiTrash2 aria-hidden="true" /> Delete
        </Button>
      </div>
    </article>
  )
}

export function VocabularyMiniCard({ vocabulary }) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FiBookOpen aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold">{getVocabularyTerm(vocabulary)}</p>
          <p className="text-sm text-muted-foreground">{getVocabularyMeaning(vocabulary)}</p>
        </div>
      </div>
    </div>
  )
}
