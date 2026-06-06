import { FiCpu, FiFolderPlus, FiSave } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import DictionaryAudioButton from './DictionaryAudioButton'

export default function DictionaryWordHeader({ result, isAiLoading, onSaveVocabulary, onAddToCollection, onAiEnrich }) {
  const meaningCount = result.meanings.reduce((count, meaning) => count + meaning.definitions.length, 0)

  return (
    <section className="rounded-card border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{meaningCount} definitions</Badge>
            {result.audioUrl ? <Badge variant="success">Audio available</Badge> : <Badge variant="muted">No audio</Badge>}
          </div>
          <h2 className="mt-4 text-5xl font-bold tracking-tight text-foreground">{result.word}</h2>
          <p className="mt-3 text-2xl font-semibold text-primary">{result.phonetic || 'Pronunciation unavailable'}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <DictionaryAudioButton audioUrl={result.audioUrl} />
          <Button onClick={onSaveVocabulary}><FiSave aria-hidden="true" /> Save To Vocabulary</Button>
          <Button variant="outline" onClick={onAddToCollection}><FiFolderPlus aria-hidden="true" /> Add To Collection</Button>
          <Button variant="secondary" onClick={onAiEnrich} disabled={isAiLoading}>
            <FiCpu aria-hidden="true" /> {isAiLoading ? 'Enriching...' : 'AI Enrich'}
          </Button>
        </div>
      </div>
    </section>
  )
}
