import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FiCheckCircle, FiClipboard, FiCode, FiDownload, FiInfo, FiList, FiUploadCloud, FiX, FiZap } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ErrorFallback from '@/components/common/ErrorFallback'
import { extractAiVocabularyRows, getFriendlyAiError } from '@/features/ai/aiUtils'
import { useNormalizeBulkVocabulary } from '@/features/ai/useNormalizeVocabulary'
import { useBulkCreateCollectionVocabularies } from '@/features/vocabulary/useVocabularies'
import {
  createEmptyVocabularyImportRow,
  getVocabularyImportRowErrors,
  mapImportRowToCreateRequest,
  normalizeVocabularyImportRow,
} from '@/features/vocabulary/vocabularyImportUtils'
import GroqApiKeyCard from './GroqApiKeyCard'
import VocabularyPreviewTable from './VocabularyPreviewTable'

const tabs = [
  { id: 'json', label: 'JSON Import', icon: FiCode },
  { id: 'wordList', label: 'Raw Word List', icon: FiList },
  { id: 'ai', label: 'AI Normalize', icon: FiZap },
]

const workflowSteps = ['Method', 'Input', 'Review', 'Import']

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

function ImportWorkspacePanel({ title, step, description, actions, children, className = '' }) {
  return (
    <section className={`rounded-card border border-border bg-card p-4 text-card-foreground shadow-sm ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {step ? <Badge variant="secondary">{step}</Badge> : null}
            <h3 className="truncate text-base font-semibold tracking-tight">{title}</h3>
          </div>
          {description ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function ImportModeTabs({ activeTab, onChange, disabled }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-border" role="tablist" aria-label="Import mode">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => onChange(tab.id)}
            className={`-mb-px inline-flex h-10 items-center justify-center gap-2 rounded-t-button border px-4 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-60 ${
              isActive
                ? 'border-border border-b-card bg-card text-foreground shadow-sm'
                : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon aria-hidden="true" /> {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function parseWordList(value) {
  return value
    .split(/[\r\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((term) => ({ ...createEmptyVocabularyImportRow(), term }))
}

function parseRawTerms(value) {
  return value.split(/[\r\n,]+/).map((item) => item.trim()).filter(Boolean)
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

function normalizeBulkCreateResult(payload, fallbackTotal = 0) {
  const failedItems = payload?.failedItems || payload?.errors || []
  const normalizedFailedItems = failedItems.map((item, index) => ({
    row: item.row ?? item.index ?? index + 1,
    term: item.term || item.word || '',
    reason: item.reason || item.message || 'Failed to save this row',
  }))

  return {
    successCount: payload?.successCount ?? payload?.created ?? payload?.createdCount ?? Math.max(0, fallbackTotal - normalizedFailedItems.length),
    failedCount: payload?.failedCount ?? payload?.failed ?? payload?.failedItems?.length ?? normalizedFailedItems.length,
    failedItems: normalizedFailedItems,
  }
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
    <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
      <ImportWorkspacePanel
        step="Step 2"
        title="Paste JSON"
        description="Paste an array of vocabulary objects, then validate it."
        actions={<Button variant="outline" onClick={copySampleJson}><FiClipboard aria-hidden="true" /> Copy JSON</Button>}
      >
        <textarea
          value={jsonText}
          disabled={disabled}
          onChange={(event) => setJsonText(event.target.value)}
          className="min-h-[360px] w-full rounded-button border border-input bg-background p-4 font-mono text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60 xl:min-h-[46vh]"
          placeholder={sampleJson}
        />
        {error ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={validateJson} disabled={disabled || !jsonText.trim()}>
            <FiCheckCircle aria-hidden="true" /> Validate JSON
          </Button>
          <Button variant="secondary" onClick={() => setJsonText(sampleJson)} disabled={disabled}>Use Sample</Button>
        </div>
      </ImportWorkspacePanel>

      <ImportWorkspacePanel
        step="Step 3"
        title="Preview Rows"
        description="Edit rows and fix required fields before importing."
        actions={<Badge variant={rows.length ? 'primary' : 'muted'}>{rows.length} rows</Badge>}
      >
        <VocabularyPreviewTable rows={rows} onChangeRows={setRows} disabled={disabled} />
      </ImportWorkspacePanel>
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
    <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
      <ImportWorkspacePanel
        step="Step 2"
        title="Raw Word List"
        description="Paste one word or phrase per line."
      >
        <textarea
          value={wordListText}
          disabled={disabled}
          onChange={(event) => setWordListText(event.target.value)}
          className="min-h-[360px] w-full rounded-button border border-input bg-background p-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60 xl:min-h-[46vh]"
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
      </ImportWorkspacePanel>

      <ImportWorkspacePanel
        step="Step 3"
        title="Word Preview"
        description="Raw rows need meanings before import. AI Normalize can fill them."
        actions={<Badge variant={rows.length ? 'warning' : 'muted'}>{rows.length} rows</Badge>}
      >
        <VocabularyPreviewTable rows={rows} onChangeRows={setRows} disabled={disabled} />
      </ImportWorkspacePanel>
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
  normalizeBulkMutation,
  disabled,
}) {
  const normalizeWithAi = async () => {
    try {
      const rawTerms = parseRawTerms(rawText)
      if (!rawTerms.length) {
        toast.error('Enter at least one English word')
        return
      }
      if (!groqApiKey.trim()) {
        toast.error('Enter your Groq API key before running AI Normalize')
        return
      }
      const oversizedTerm = rawTerms.find((term) => term.length > 150)
      if (oversizedTerm) {
        toast.error(`"${oversizedTerm.slice(0, 40)}..." is longer than 150 characters`)
        return
      }

      const payload = {
        rawText: rawText.trim(),
        provider: 'GROQ',
        userApiKey: groqApiKey.trim(),
      }
      const result = await normalizeBulkMutation.mutateAsync(payload)
      const nextRows = extractAiVocabularyRows(result).map((row) => ({
        term: row.term,
        meaning: row.meaning,
        vietnameseMeaning: row.vietnameseMeaning,
        pronunciation: row.pronunciation,
        partOfSpeech: row.partOfSpeech,
        exampleSentence: row.exampleSentence,
        note: row.aiExplanation || '',
      }))
      if (!nextRows.length) throw new Error('AI response did not include vocabulary rows')
      setRows(nextRows)
      toast.success(`${nextRows.length} AI-normalized rows ready`)
    } catch (error) {
      toast.error(getFriendlyAiError(error).description)
    }
  }
  const isNormalizing = normalizeBulkMutation.isPending
  const normalizeError = normalizeBulkMutation.error

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <ImportWorkspacePanel
          step="Step 2"
          title="Normalize With AI"
          description="Paste English words separated by new lines or commas."
        >
          <textarea
            value={rawText}
            disabled={disabled || isNormalizing}
            onChange={(event) => setRawText(event.target.value)}
            className="min-h-64 w-full rounded-button border border-input bg-background p-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60 xl:min-h-[32vh]"
            placeholder={'abandon\nbenefit\nconsequence\nmaintain'}
          />
          <Button className="mt-4 w-full" size="lg" onClick={normalizeWithAi} disabled={disabled || isNormalizing || !rawText.trim()}>
            <FiZap aria-hidden="true" /> {isNormalizing ? 'Normalizing...' : 'Normalize With AI'}
          </Button>
        </ImportWorkspacePanel>

        <GroqApiKeyCard value={groqApiKey} disabled={disabled || isNormalizing} onChange={setGroqApiKey} />
      </div>

      <ImportWorkspacePanel
        step="Step 3"
        title="AI Result Preview"
        description="Review and edit every row before adding it to the collection."
        actions={isNormalizing ? <Badge variant="warning">AI running</Badge> : <Badge variant={rows.length ? 'success' : 'muted'}>{rows.length} rows</Badge>}
      >
        {normalizeError ? (
          <ErrorFallback title={getFriendlyAiError(normalizeError).title} description={getFriendlyAiError(normalizeError).description} onRetry={normalizeWithAi} />
        ) : (
          <VocabularyPreviewTable rows={rows} onChangeRows={setRows} disabled={disabled || isNormalizing} />
        )}
      </ImportWorkspacePanel>
    </div>
  )
}

export default function ImportVocabularyDialog({ open, collectionId, onClose, onImported }) {
  const [activeTab, setActiveTab] = useState('json')
  const [jsonText, setJsonText] = useState(sampleJson)
  const [jsonError, setJsonError] = useState('')
  const [wordListText, setWordListText] = useState('')
  const [aiRawText, setAiRawText] = useState('')
  const [groqApiKey, setGroqApiKey] = useState('')
  const [rows, setRows] = useState([])
  const [bulkProgress, setBulkProgress] = useState({ created: 0, total: 0 })
  const [bulkResult, setBulkResult] = useState(null)
  const normalizeBulkMutation = useNormalizeBulkVocabulary()
  const bulkCreateMutation = useBulkCreateCollectionVocabularies()

  const validation = useMemo(() => getRowsValidation(rows), [rows])
  const isBusy = normalizeBulkMutation.isPending || bulkCreateMutation.isPending

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
      setBulkResult(null)
      setBulkProgress({ created: 0, total: rows.length })
      const result = await bulkCreateMutation.mutateAsync({
        collectionId,
        items: rows.map(mapImportRowToCreateRequest),
      })
      const summary = normalizeBulkCreateResult(result, rows.length)
      setBulkResult(summary)
      setBulkProgress({ created: summary.successCount, total: rows.length })
      toast.success(`${summary.successCount} vocabulary items added`)
      onImported?.()
    } catch (error) {
      const errorPayload = error?.details?.data || error?.details?.result || error?.details
      if (errorPayload?.failedItems || errorPayload?.errors) {
        setBulkResult(normalizeBulkCreateResult(errorPayload, rows.length))
      }
      toast.error(error.message || 'Unable to bulk create vocabulary')
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-3 backdrop-blur-sm" role="presentation">
      <section className="flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-dialog border border-border bg-card text-card-foreground shadow-xl" role="dialog" aria-modal="true" aria-labelledby="import-vocabulary-title">
        <div className="border-b border-primary/10 bg-gradient-to-r from-primary/10 via-card to-card p-4 backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <FiUploadCloud aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 id="import-vocabulary-title" className="truncate text-xl font-bold tracking-tight">Import Vocabularies</h2>
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-button text-primary hover:bg-primary/10"
                    title="Paste JSON, start from a raw word list, or normalize with AI. Review and edit everything before bulk create."
                    aria-label="Import help"
                  >
                    <FiInfo aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">Choose a source, edit the preview, then add valid rows.</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden flex-wrap items-center gap-1.5 md:flex" aria-label="Import workflow">
                {workflowSteps.map((step, index) => (
                  <div key={step} className="inline-flex h-8 items-center gap-2 rounded-full border border-primary/15 bg-card/80 px-3 text-xs font-semibold text-muted-foreground shadow-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] text-primary">{index + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="h-10 w-10 border border-border bg-card/80 px-0 hover:border-primary/30 hover:bg-primary/10 hover:text-primary" onClick={onClose} disabled={isBusy} aria-label="Close import vocabulary dialog">
                <FiX aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-muted/20 p-4">
          <div className="rounded-card border border-border bg-card">
            <div className="px-4 pt-3">
              <ImportModeTabs activeTab={activeTab} onChange={setActiveTab} disabled={isBusy} />
            </div>

            <div className="p-4">
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
                  normalizeBulkMutation={normalizeBulkMutation}
                  disabled={isBusy}
                />
              ) : null}
            </div>
          </div>

          {bulkResult ? (
            <ImportWorkspacePanel
              className="mt-4"
              title="Bulk add result"
              description="Result returned by the collection bulk add endpoint."
              actions={<Badge variant={bulkResult.failedCount ? 'warning' : 'success'}>{bulkResult.successCount} saved / {bulkResult.failedCount} failed</Badge>}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="text-sm font-semibold text-muted-foreground">successCount</p>
                  <p className="mt-2 text-3xl font-bold text-success">{bulkResult.successCount}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="text-sm font-semibold text-muted-foreground">failedCount</p>
                  <p className="mt-2 text-3xl font-bold text-destructive">{bulkResult.failedCount}</p>
                </div>
              </div>

              {bulkResult.failedItems.length ? (
                <div className="mt-4 overflow-x-auto rounded-card border border-border">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-border bg-muted/60 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Row</th>
                        <th className="px-4 py-3">Term</th>
                        <th className="px-4 py-3">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {bulkResult.failedItems.map((item, index) => (
                        <tr key={`${item.row}-${item.term}-${index}`}>
                          <td className="px-4 py-3">{item.row}</td>
                          <td className="px-4 py-3 font-semibold">{item.term || '-'}</td>
                          <td className="px-4 py-3 text-destructive">{item.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">No failed items returned.</p>
              )}
            </ImportWorkspacePanel>
          ) : null}
        </div>

        <div className="border-t border-border bg-card/95 p-3 backdrop-blur">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={rows.length ? 'primary' : 'muted'}>{rows.length} rows</Badge>
                <Badge variant={validation.valid ? 'success' : 'warning'}>{validation.invalidRows.length} invalid rows</Badge>
                {bulkCreateMutation.isPending ? <Badge variant="warning">Creating {bulkProgress.created}/{bulkProgress.total}</Badge> : null}
              </div>
              {validation.invalidRows.length ? (
                <p className="mt-2 text-sm text-warning">Rows with missing term, long term, or missing meaning must be fixed before adding.</p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Step 4: review data, then add all valid rows to this collection.</p>
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
                <FiUploadCloud aria-hidden="true" /> {bulkCreateMutation.isPending ? 'Adding...' : 'Add all to collection'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
