import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FiCheckCircle, FiClipboard, FiCode, FiDownload, FiList, FiUploadCloud, FiX, FiZap } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/common/EmptyState'
import ErrorFallback from '@/components/common/ErrorFallback'
import DashboardSection from '@/components/dashboard/DashboardSection'
import { useNormalizeVocabulary } from '@/features/ai/useNormalizeVocabulary'
import { useBulkCreateCollectionVocabularies } from '@/features/vocabulary/useVocabularies'
import {
  createEmptyVocabularyImportRow,
  getVocabularyImportRowErrors,
  mapImportRowToCreateRequest,
  normalizeVocabularyImportRow,
} from '@/features/vocabulary/vocabularyImportUtils'
import GroqApiKeyCard, { GROQ_API_KEY_STORAGE_KEY } from './GroqApiKeyCard'
import VocabularyPreviewTable from './VocabularyPreviewTable'

const tabs = [
  { id: 'json', label: 'JSON Import', icon: FiCode },
  { id: 'wordList', label: 'Raw Word List', icon: FiList },
  { id: 'ai', label: 'AI Normalize', icon: FiZap },
]

const sampleRows = [
  {
    term: 'abandon',
    meaning: 'to leave something permanently',
    vietnameseMeaning: 't\u1eeb b\u1ecf',
    pronunciation: '/\u0259\u02c8b\u00e6nd\u0259n/',
    partOfSpeech: 'verb',
    exampleSentence: 'He abandoned the project.',
    note: '',
  },
]

const sampleJson = JSON.stringify(sampleRows, null, 2)

function getInitialGroqApiKey() {
  try {
    return localStorage.getItem(GROQ_API_KEY_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

function persistGroqApiKey(value) {
  try {
    if (value) localStorage.setItem(GROQ_API_KEY_STORAGE_KEY, value)
    else localStorage.removeItem(GROQ_API_KEY_STORAGE_KEY)
  } catch {
    // localStorage may be unavailable in restricted browser contexts.
  }
}

function normalizeAiResult(payload) {
  const source = payload?.vocabularies || payload?.items || payload?.rows || payload?.results || payload?.data || payload
  if (Array.isArray(source)) return source.map(normalizeVocabularyImportRow)
  if (source && typeof source === 'object') return [normalizeVocabularyImportRow(source)]
  return []
}

function parseWordList(value) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((term) => ({ ...createEmptyVocabularyImportRow(), term }))
}

function getRowsValidation(rows) {
  const invalidRows = rows
    .map((row, index) => ({ index, errors: getVocabularyImportRowErrors(row) }))
    .filter((item) => Object.keys(item.errors).length)

  return {
    valid: rows.length > 0 && invalidRows.length === 0,
    invalidRows,
  }
}

function downloadJson(filename, rows) {
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })
  const objectUrl = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000)
}

function JsonImportTab({ jsonText, setJsonText, rows, setRows, error, setError, disabled }) {
  const validateJson = () => {
    try {
      const parsed = JSON.parse(jsonText)
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of vocabulary objects')
      }
      const nextRows = parsed.map(normalizeVocabularyImportRow)
      setRows(nextRows)
      setError('')
      toast.success(`${nextRows.length} vocabulary rows loaded`)
    } catch (parseError) {
      setError(parseError.message || 'Invalid JSON')
    }
  }

  const copySampleJson = async () => {
    try {
      await navigator.clipboard.writeText(sampleJson)
      toast.success('Sample JSON copied')
    } catch {
      toast.error('Unable to copy sample JSON')
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <DashboardSection
        title="Paste JSON"
        description="Paste an array of vocabulary objects, validate it, then edit rows before creating."
        actions={<Button variant="outline" onClick={copySampleJson}><FiClipboard aria-hidden="true" /> Copy JSON</Button>}
      >
        <textarea
          value={jsonText}
          disabled={disabled}
          onChange={(event) => setJsonText(event.target.value)}
          className="min-h-80 w-full rounded-button border border-input bg-background p-4 font-mono text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
          placeholder={sampleJson}
        />
        {error ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={validateJson} disabled={disabled || !jsonText.trim()}>
            <FiCheckCircle aria-hidden="true" /> Validate JSON
          </Button>
          <Button variant="secondary" onClick={() => setJsonText(sampleJson)} disabled={disabled}>Use Sample</Button>
        </div>
      </DashboardSection>

      <DashboardSection
        title="Preview Rows"
        description="Rows are editable. Required fields are validated before bulk create."
        actions={<Badge variant={rows.length ? 'primary' : 'muted'}>{rows.length} rows</Badge>}
      >
        <VocabularyPreviewTable rows={rows} onChangeRows={setRows} disabled={disabled} />
      </DashboardSection>
    </div>
  )
}

function WordListImportTab({ wordListText, setWordListText, rows, setRows, onSendToAi, disabled }) {
  const previewWordList = () => {
    const nextRows = parseWordList(wordListText)
    setRows(nextRows)
    toast.success(`${nextRows.length} words prepared for preview`)
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <DashboardSection
        title="Raw Word List"
        description="Paste one word or phrase per line. Send it to AI Normalize to fill meanings and examples."
      >
        <textarea
          value={wordListText}
          disabled={disabled}
          onChange={(event) => setWordListText(event.target.value)}
          className="min-h-80 w-full rounded-button border border-input bg-background p-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
          placeholder={'abandon\nbenefit\nconsequence\nmaintain'}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={previewWordList} disabled={disabled || !wordListText.trim()}>
            <FiList aria-hidden="true" /> Preview Word List
          </Button>
          <Button variant="secondary" onClick={() => onSendToAi(wordListText)} disabled={disabled || !wordListText.trim()}>
            <FiZap aria-hidden="true" /> Send to AI Normalize
          </Button>
        </div>
      </DashboardSection>

      <DashboardSection
        title="Word Preview"
        description="Raw word rows need meanings before Create All is enabled. AI Normalize is the fastest path."
        actions={<Badge variant={rows.length ? 'warning' : 'muted'}>{rows.length} rows</Badge>}
      >
        <VocabularyPreviewTable rows={rows} onChangeRows={setRows} disabled={disabled} />
      </DashboardSection>
    </div>
  )
}

function AiNormalizeTab({
  rawText,
  setRawText,
  groqApiKey,
  setGroqApiKey,
  rows,
  setRows,
  normalizeMutation,
  disabled,
}) {
  const normalizeWithAi = async () => {
    try {
      const result = await normalizeMutation.mutateAsync({
        rawText,
        ...(groqApiKey.trim() ? { groqApiKey: groqApiKey.trim() } : {}),
      })
      const nextRows = normalizeAiResult(result)
      if (!nextRows.length) throw new Error('AI response did not include vocabulary rows')
      setRows(nextRows)
      toast.success(`${nextRows.length} AI-normalized rows ready`)
    } catch (error) {
      toast.error(error.message || 'Unable to normalize vocabulary with AI')
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <DashboardSection
          title="Normalize With AI"
          description="Paste raw words, phrases, or messy notes. Review the AI result before saving."
        >
          <textarea
            value={rawText}
            disabled={disabled || normalizeMutation.isPending}
            onChange={(event) => setRawText(event.target.value)}
            className="min-h-56 w-full rounded-button border border-input bg-background p-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
            placeholder={'abandon\nbenefit\nconsequence\nmaintain'}
          />
          <Button className="mt-4 w-full" size="lg" onClick={normalizeWithAi} disabled={disabled || normalizeMutation.isPending || !rawText.trim()}>
            <FiZap aria-hidden="true" /> {normalizeMutation.isPending ? 'Normalizing...' : 'Normalize With AI'}
          </Button>
        </DashboardSection>

        <GroqApiKeyCard
          value={groqApiKey}
          disabled={disabled || normalizeMutation.isPending}
          onChange={(value) => {
            setGroqApiKey(value)
            persistGroqApiKey(value)
          }}
        />
      </div>

      <DashboardSection
        title="AI Result Preview"
        description="Edit any cell before bulk creating vocabulary."
        actions={normalizeMutation.isPending ? <Badge variant="warning">AI running</Badge> : <Badge variant={rows.length ? 'success' : 'muted'}>{rows.length} rows</Badge>}
      >
        {normalizeMutation.error ? (
          <ErrorFallback title="AI normalize failed" description={normalizeMutation.error.message} onRetry={normalizeWithAi} />
        ) : (
          <VocabularyPreviewTable rows={rows} onChangeRows={setRows} disabled={disabled || normalizeMutation.isPending} />
        )}
      </DashboardSection>
    </div>
  )
}

export default function ImportVocabularyDialog({ open, collectionId, onClose, onImported }) {
  const [activeTab, setActiveTab] = useState('json')
  const [jsonText, setJsonText] = useState(sampleJson)
  const [jsonError, setJsonError] = useState('')
  const [wordListText, setWordListText] = useState('')
  const [aiRawText, setAiRawText] = useState('')
  const [groqApiKey, setGroqApiKey] = useState(getInitialGroqApiKey)
  const [rows, setRows] = useState([])
  const [bulkProgress, setBulkProgress] = useState({ created: 0, total: 0 })
  const normalizeMutation = useNormalizeVocabulary()
  const bulkCreateMutation = useBulkCreateCollectionVocabularies()

  const validation = useMemo(() => getRowsValidation(rows), [rows])
  const isBusy = normalizeMutation.isPending || bulkCreateMutation.isPending

  if (!open) return null

  const handleSendWordListToAi = (value) => {
    setAiRawText(value)
    setActiveTab('ai')
  }

  const handleCopyRows = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(rows, null, 2))
      toast.success('Preview JSON copied')
    } catch {
      toast.error('Unable to copy preview JSON')
    }
  }

  const handleCreateAll = async () => {
    if (!validation.valid) {
      toast.error('Fix row validation errors before creating')
      return
    }

    try {
      setBulkProgress({ created: 0, total: rows.length })
      await bulkCreateMutation.mutateAsync({
        collectionId,
        vocabularies: rows.map(mapImportRowToCreateRequest),
      })
      setBulkProgress({ created: rows.length, total: rows.length })
      toast.success(`${rows.length} vocabulary items created`)
      onImported?.()
      onClose()
    } catch (error) {
      toast.error(error.message || 'Unable to bulk create vocabulary')
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-3 backdrop-blur-sm" role="presentation">
      <section className="max-h-[94vh] w-full max-w-7xl overflow-y-auto rounded-dialog border border-border bg-card text-card-foreground shadow-xl" role="dialog" aria-modal="true" aria-labelledby="import-vocabulary-title">
        <div className="sticky top-0 z-10 border-b border-border bg-card/95 p-5 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Collection import</p>
              <h2 id="import-vocabulary-title" className="mt-2 text-3xl font-bold tracking-tight">Import Vocabularies</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Paste JSON, start from a raw word list, or normalize with AI. Review and edit everything before bulk create.</p>
            </div>
            <Button variant="ghost" className="h-10 w-10 px-0" onClick={onClose} disabled={isBusy} aria-label="Close import vocabulary dialog">
              <FiX aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button key={tab.id} variant={activeTab === tab.id ? 'primary' : 'secondary'} onClick={() => setActiveTab(tab.id)} disabled={isBusy}>
                  <Icon aria-hidden="true" /> {tab.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="space-y-5 p-5">
          {!rows.length ? (
            <EmptyState
              icon={FiUploadCloud}
              title="No import preview yet"
              description="Validate JSON, preview a raw word list, or run AI Normalize to generate editable rows."
            />
          ) : null}

          {activeTab === 'json' ? (
            <JsonImportTab
              jsonText={jsonText}
              setJsonText={setJsonText}
              rows={rows}
              setRows={setRows}
              error={jsonError}
              setError={setJsonError}
              disabled={isBusy}
            />
          ) : null}

          {activeTab === 'wordList' ? (
            <WordListImportTab
              wordListText={wordListText}
              setWordListText={setWordListText}
              rows={rows}
              setRows={setRows}
              onSendToAi={handleSendWordListToAi}
              disabled={isBusy}
            />
          ) : null}

          {activeTab === 'ai' ? (
            <AiNormalizeTab
              rawText={aiRawText}
              setRawText={setAiRawText}
              groqApiKey={groqApiKey}
              setGroqApiKey={setGroqApiKey}
              rows={rows}
              setRows={setRows}
              normalizeMutation={normalizeMutation}
              disabled={isBusy}
            />
          ) : null}
        </div>

        <div className="sticky bottom-0 z-10 border-t border-border bg-card/95 p-5 backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={rows.length ? 'primary' : 'muted'}>{rows.length} rows</Badge>
                <Badge variant={validation.valid ? 'success' : 'warning'}>{validation.invalidRows.length} invalid rows</Badge>
                {bulkCreateMutation.isPending ? <Badge variant="warning">Creating {bulkProgress.created}/{bulkProgress.total}</Badge> : null}
              </div>
              {validation.invalidRows.length ? (
                <p className="mt-2 text-sm text-warning">Rows with missing term or meaning must be fixed before Create All.</p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Bulk create sends one request to the collection import endpoint. No one-by-one creation required.</p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" disabled={isBusy || !rows.length} onClick={handleCopyRows}>
                <FiClipboard aria-hidden="true" /> Copy JSON
              </Button>
              <Button variant="outline" disabled={isBusy || !rows.length} onClick={() => downloadJson(`vocabverse-import-${collectionId}.json`, rows)}>
                <FiDownload aria-hidden="true" /> Download JSON
              </Button>
              <Button size="lg" disabled={isBusy || !validation.valid} onClick={handleCreateAll}>
                <FiUploadCloud aria-hidden="true" /> {bulkCreateMutation.isPending ? 'Creating All...' : 'Create All'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
