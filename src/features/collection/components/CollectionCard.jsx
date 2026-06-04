import { FiCalendar, FiEdit3, FiExternalLink, FiLock, FiTrash2, FiUsers } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatCollectionDate, getCollectionTitle, getVocabularyCount } from '../collectionUtils'

function getVisibilityVariant(visibility) {
  if (visibility === 'PUBLIC') return 'success'
  if (visibility === 'SYSTEM') return 'primary'
  return 'secondary'
}

function getVisibilityIcon(visibility) {
  if (visibility === 'PUBLIC') return <FiUsers aria-hidden="true" className="h-3.5 w-3.5" />
  return <FiLock aria-hidden="true" className="h-3.5 w-3.5" />
}

export default function CollectionCard({ collection, onOpen, onEdit, onDelete }) {
  const visibility = collection.visibility || 'PRIVATE'
  const isSystem = visibility === 'SYSTEM'
  const title = getCollectionTitle(collection)
  const vocabularyCount = getVocabularyCount(collection)
  const updatedDate = collection.updatedAt || collection.lastUpdated || collection.createdAt

  return (
    <article className="group flex h-full flex-col rounded-card border border-border bg-card p-5 text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Badge variant={getVisibilityVariant(visibility)}>
          <span className="inline-flex items-center gap-1.5">
            {getVisibilityIcon(visibility)}
            {visibility}
          </span>
        </Badge>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {vocabularyCount} words
        </span>
      </div>

      <div className="mt-5 flex-1">
        <h2 className="line-clamp-2 text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-3 line-clamp-3 min-h-18 text-sm leading-6 text-muted-foreground">
          {collection.description || 'No description yet. Add context so this collection is easier to study later.'}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        <FiCalendar aria-hidden="true" className="h-4 w-4" />
        <span>Updated {formatCollectionDate(updatedDate)}</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <Button variant="secondary" onClick={() => onOpen(collection)} aria-label={`Open ${title}`}>
          <FiExternalLink aria-hidden="true" /> Open
        </Button>
        <Button variant="outline" onClick={() => onEdit(collection)} aria-label={`Edit ${title}`}>
          <FiEdit3 aria-hidden="true" /> Edit
        </Button>
        <Button variant="outline" onClick={() => onDelete(collection)} disabled={isSystem} aria-label={`Delete ${title}`}>
          <FiTrash2 aria-hidden="true" /> Delete
        </Button>
      </div>
    </article>
  )
}
