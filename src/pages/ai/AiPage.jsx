import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { FiBookOpen, FiClipboard, FiCpu, FiRefreshCw, FiSave, FiZap } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/common/EmptyState'
import ErrorFallback from '@/components/common/ErrorFallback'
import PageHeader from '@/components/common/PageHeader'
import ResponsiveContentContainer from '@/components/common/ResponsiveContentContainer'
import FormField from '@/components/forms/FormField'
import { formInputClass } from '@/components/forms/formStyles'
import { getCollectionTitle } from '@/features/collection/collectionUtils'
import { useCollections } from '@/features/collection/useCollections'
import { useNormalizeVocabulary } from '@/features/ai/useNormalizeVocabulary'
import {
  extractAiNormalizeQuotaInfo,
  getFriendlyAiError,
  isValidAiVocabularyResult,
  normalizeAiVocabularyResult,
  normalizeStringList,
} from '@/features/ai/aiUtils'
import { useCreateVocabulary } from '@/features/vocabulary/useVocabularies'

const normalizeSchema = z.object({
  rawText: z.string().trim().min(1, 'Vui lòng nhập nội dung từ vựng cần normalize.').max(500, 'Nội dung tối đa 500 ký tự.'),
})

const saveSchema = z.object({
  term: z.string().trim().min(1, 'Term is required').max(150, 'Term must be 150 characters or less'),
  meaning: z.string().trim().min(1, 'Meaning is required').max(500, 'Meaning must be 500 characters or less'),
  pronunciation: z.string().trim().max(150, 'Pronunciation is too long').optional(),
  partOfSpeech: z.string().trim().max(80, 'Part of speech is too long').optional(),
  exampleSentence: z.string().trim().max(1000, 'Example sentence is too long').optional(),
  vietnameseMeaning: z.string().trim().max(500, 'Vietnamese meaning is too long').optional(),
  note: z.string().trim().max(1000, 'Note is too long').optional(),
  collectionIds: z.array(z.string()).optional(),
})

function normalizeCollectionList(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.content || payload?.items || payload?.data || payload?.collections || []
}

function difficultyVariant(difficulty) {
  if (difficulty === 'EASY') return 'success'
  if (difficulty === 'HARD') return 'destructive'
  if (difficulty === 'MEDIUM') return 'warning'
  return 'secondary'
}

function FieldValue({ label, value, emptyLabel = 'Not returned' }) {
  const isList = Array.isArray(value)
  const hasValue = isList ? value.length > 0 : Boolean(value)

  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      {isList ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.length ? value.map((item) => <Badge key={item} variant="secondary">{item}</Badge>) : <span className="text-sm text-muted-foreground">{emptyLabel}</span>}
        </div>
      ) : (
        <p className={`mt-2 whitespace-pre-wrap font-semibold leading-7 ${hasValue ? 'text-foreground' : 'text-muted-foreground'}`}>{hasValue ? value : emptyLabel}</p>
      )}
    </div>
  )
}

function AiProcessingSkeleton() {
  return (
    <div className="rounded-card border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FiZap aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
          <div className="mt-2 h-3 w-64 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
      </div>
      <div className="mt-3 h-24 animate-pulse rounded-2xl bg-muted" />
    </div>
  )
}

function AiSuggestionPreview({ result, onCopy }) {
  return (
    <article className="rounded-card border border-primary/25 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">AI suggestion</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight">{result.term || 'Untitled term'}</h2>
          <p className="mt-2 text-sm font-semibold text-primary">{result.pronunciation || 'No pronunciation returned'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={result.partOfSpeech ? 'primary' : 'muted'}>{result.partOfSpeech || 'No part of speech'}</Badge>
          <Badge variant={difficultyVariant(result.difficulty)}>{result.difficulty || 'No difficulty'}</Badge>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <FieldValue label="term" value={result.term} />
        <FieldValue label="meaning" value={result.meaning} />
        <FieldValue label="vietnameseMeaning" value={result.vietnameseMeaning} />
        <FieldValue label="pronunciation" value={result.pronunciation} />
        <FieldValue label="partOfSpeech" value={result.partOfSpeech} />
        <FieldValue label="exampleSentence" value={result.exampleSentence} />
        <FieldValue label="synonyms" value={result.synonyms} emptyLabel="No synonyms returned" />
        <FieldValue label="antonyms" value={result.antonyms} emptyLabel="No antonyms returned" />
        <FieldValue label="difficulty" value={result.difficulty} />
        <FieldValue label="aiExplanation" value={result.aiExplanation} />
      </div>

      <Button className="mt-5" variant="secondary" onClick={onCopy}>
        <FiClipboard aria-hidden="true" /> Copy result
      </Button>
    </article>
  )
}

function AiQuotaNotice({ quotaInfo }) {
  if (!quotaInfo) return null

  const hasRemaining = quotaInfo.remainingUses !== undefined && quotaInfo.remainingUses !== null
  const hasLimit = quotaInfo.dailyLimit !== undefined && quotaInfo.dailyLimit !== null

  if (!hasRemaining && !hasLimit) return null

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
      <p className="text-sm font-semibold text-primary">Daily AI Normalize trial</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {hasRemaining ? `${quotaInfo.remainingUses} lượt còn lại hôm nay` : 'Backend đang quản lý quota hôm nay'}
        {hasLimit ? ` / giới hạn ${quotaInfo.dailyLimit} lượt mỗi ngày.` : '.'}
      </p>
    </div>
  )
}

function AiNormalizeErrorState({ error, onRetry }) {
  const friendlyError = getFriendlyAiError(error)

  return (
    <ErrorFallback
      title={friendlyError.title}
      description={friendlyError.description}
      onRetry={onRetry}
    />
  )
}

function AiNormalizeDebugPanel({ rawResponse, parsedResult }) {
  if (!import.meta.env.DEV || (!rawResponse && !parsedResult)) return null

  return (
    <section className="rounded-card border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Development debug</p>
          <h2 className="mt-2 text-2xl font-semibold">AI response inspector</h2>
        </div>
        <Badge variant="warning">Hidden in production</Badge>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Raw AI Response</p>
          <pre className="mt-2 max-h-96 overflow-auto rounded-2xl bg-muted p-4 text-xs text-foreground">{JSON.stringify(rawResponse, null, 2)}</pre>
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Parsed JSON</p>
          <pre className="mt-2 max-h-96 overflow-auto rounded-2xl bg-muted p-4 text-xs text-foreground">{JSON.stringify(parsedResult, null, 2)}</pre>
        </div>
      </div>
    </section>
  )
}

export default function AiPage() {
  const [aiResult, setAiResult] = useState(null)
  const [rawAiResponse, setRawAiResponse] = useState(null)
  const [aiError, setAiError] = useState(null)
  const [quotaInfo, setQuotaInfo] = useState(null)
  const normalizeMutation = useNormalizeVocabulary()
  const createVocabularyMutation = useCreateVocabulary()
  const collectionsQuery = useCollections({ page: 0, size: 100 })
  const collections = normalizeCollectionList(collectionsQuery.data)

  const normalizeForm = useForm({
    resolver: zodResolver(normalizeSchema),
    defaultValues: { rawText: '' },
  })

  const saveForm = useForm({
    resolver: zodResolver(saveSchema),
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

  const noteValue = useMemo(() => {
    if (!aiResult) return ''
    const parts = []
    if (normalizeStringList(aiResult.synonyms).length) parts.push(`Synonyms: ${normalizeStringList(aiResult.synonyms).join(', ')}`)
    if (normalizeStringList(aiResult.antonyms).length) parts.push(`Antonyms: ${normalizeStringList(aiResult.antonyms).join(', ')}`)
    if (aiResult.difficulty) parts.push(`Difficulty: ${aiResult.difficulty}`)
    if (aiResult.aiExplanation) parts.push(`AI explanation: ${aiResult.aiExplanation}`)
    return parts.join('\n')
  }, [aiResult])

  useEffect(() => {
    if (!aiResult) return

    saveForm.reset({
      term: aiResult.term || '',
      meaning: aiResult.meaning || '',
      pronunciation: aiResult.pronunciation || '',
      partOfSpeech: aiResult.partOfSpeech || '',
      exampleSentence: aiResult.exampleSentence || '',
      vietnameseMeaning: aiResult.vietnameseMeaning || '',
      note: noteValue,
      collectionIds: [],
    })
  }, [aiResult, noteValue, saveForm])

  const handleNormalize = async ({ rawText }) => {
    try {
      setAiError(null)
      setAiResult(null)
      const rawResult = await normalizeMutation.mutateAsync(rawText.trim())
      const parsedResult = normalizeAiVocabularyResult(rawResult)
      setRawAiResponse(rawResult)
      setQuotaInfo(extractAiNormalizeQuotaInfo(rawResult))
      if (!isValidAiVocabularyResult(parsedResult)) {
        const invalidResponseError = new Error('AI response did not include required term and meaning fields')
        invalidResponseError.code = 'AI_RESPONSE_INVALID'
        throw invalidResponseError
      }
      setAiResult(parsedResult)
      toast.success('AI Normalize successful.')
    } catch (error) {
      setAiError(error)
      const friendlyError = getFriendlyAiError(error)
      toast.error(friendlyError.description)
    }
  }

  const handleCopy = async () => {
    if (!aiResult) return

    const text = JSON.stringify(aiResult, null, 2)
    try {
      await navigator.clipboard.writeText(text)
      toast.success('AI result copied')
    } catch {
      toast.error('Unable to copy result')
    }
  }

  const handleSaveVocabulary = async (values) => {
    try {
      const exampleSentence = values.exampleSentence?.trim()
      await createVocabularyMutation.mutateAsync({
        word: values.term.trim(),
        meaningEn: values.meaning.trim(),
        phonetic: values.pronunciation?.trim() || '',
        partOfSpeech: values.partOfSpeech?.trim() || '',
        meaningVi: values.vietnameseMeaning?.trim() || '',
        examples: exampleSentence ? [{ sentence: exampleSentence, translation: '' }] : [],
        synonyms: normalizeStringList(aiResult?.synonyms),
        antonyms: normalizeStringList(aiResult?.antonyms),
        note: values.note?.trim() || '',
        collectionIds: values.collectionIds || [],
      })
      toast.success('Vocabulary saved')
    } catch (error) {
      toast.error(error.message || 'Unable to save vocabulary')
    }
  }

  const handleReset = () => {
    setAiResult(null)
    setRawAiResponse(null)
    setAiError(null)
    setQuotaInfo(null)
    normalizeMutation.reset()
    normalizeForm.reset({ rawText: '' })
    saveForm.reset({
      term: '',
      meaning: '',
      pronunciation: '',
      partOfSpeech: '',
      exampleSentence: '',
      vietnameseMeaning: '',
      note: '',
      collectionIds: [],
    })
  }

  const isSaving = createVocabularyMutation.isPending
  const isProcessing = normalizeMutation.isPending
  const displayError = aiError || normalizeMutation.error

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="AI normalize"
        title="AI Vocabulary Normalize"
        description="Input raw vocabulary text. Backend uses the system Groq API key and enforces the daily trial quota."
        actions={aiResult ? <Button variant="secondary" onClick={handleReset}><FiRefreshCw aria-hidden="true" /> New normalize</Button> : null}
      />

      <AiQuotaNotice quotaInfo={quotaInfo} />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-card border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FiCpu aria-hidden="true" className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Raw input</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Backend uses the system Groq API key. This trial flow never asks for your Groq key.</p>
            </div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={normalizeForm.handleSubmit(handleNormalize)} noValidate>
            <FormField id="rawText" label="Raw vocabulary input" error={normalizeForm.formState.errors.rawText?.message} hint="Maximum 500 characters. Backend enforces the 3-times-per-day trial quota.">
              <textarea
                id="rawText"
                disabled={isProcessing}
                className="min-h-40 w-full rounded-button border border-input bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Example: abandon - to leave permanently, verb, He abandoned the project."
                aria-invalid={Boolean(normalizeForm.formState.errors.rawText)}
                {...normalizeForm.register('rawText')}
              />
            </FormField>

            <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
              {isProcessing ? 'Normalizing...' : 'AI Normalize'}
              <FiZap aria-hidden="true" />
            </Button>
          </form>
        </article>

        <div className="space-y-6">
          {isProcessing ? <AiProcessingSkeleton /> : null}

          {displayError && !isProcessing ? (
            <AiNormalizeErrorState error={displayError} onRetry={normalizeForm.handleSubmit(handleNormalize)} />
          ) : null}

          {!aiResult && !isProcessing && !displayError ? (
            <EmptyState
              icon={FiZap}
              title="No AI suggestion yet"
              description="Enter raw vocabulary input, then the normalized JSON preview will appear here with meaning, pronunciation, examples, synonyms, antonyms, difficulty, and explanation."
              action={<Button variant="secondary" onClick={() => normalizeForm.setFocus('rawText')}>Start with a word</Button>}
            />
          ) : null}

          {aiResult ? <AiSuggestionPreview result={aiResult} onCopy={handleCopy} /> : null}
        </div>
      </section>

      <AiNormalizeDebugPanel rawResponse={rawAiResponse} parsedResult={aiResult} />

      {aiResult ? (
        <section className="rounded-card border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Review and save</p>
              <h2 className="mt-2 text-3xl font-semibold">Save as vocabulary</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Edit any AI field before saving. Collection selection is optional.</p>
            </div>
            <Badge variant="primary">Editable preview</Badge>
          </div>

          <form className="mt-6 space-y-5" onSubmit={saveForm.handleSubmit(handleSaveVocabulary)} noValidate>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField id="ai-term" label="Term" error={saveForm.formState.errors.term?.message}>
                <input id="ai-term" disabled={isSaving} className={formInputClass(Boolean(saveForm.formState.errors.term))} aria-invalid={Boolean(saveForm.formState.errors.term)} {...saveForm.register('term')} />
              </FormField>
              <FormField id="ai-pronunciation" label="Pronunciation" error={saveForm.formState.errors.pronunciation?.message}>
                <input id="ai-pronunciation" disabled={isSaving} className={formInputClass(Boolean(saveForm.formState.errors.pronunciation))} aria-invalid={Boolean(saveForm.formState.errors.pronunciation)} {...saveForm.register('pronunciation')} />
              </FormField>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField id="ai-meaning" label="Meaning" error={saveForm.formState.errors.meaning?.message}>
                <input id="ai-meaning" disabled={isSaving} className={formInputClass(Boolean(saveForm.formState.errors.meaning))} aria-invalid={Boolean(saveForm.formState.errors.meaning)} {...saveForm.register('meaning')} />
              </FormField>
              <FormField id="ai-vietnamese" label="Vietnamese meaning" error={saveForm.formState.errors.vietnameseMeaning?.message}>
                <input id="ai-vietnamese" disabled={isSaving} className={formInputClass(Boolean(saveForm.formState.errors.vietnameseMeaning))} aria-invalid={Boolean(saveForm.formState.errors.vietnameseMeaning)} {...saveForm.register('vietnameseMeaning')} />
              </FormField>
            </div>

            <FormField id="ai-pos" label="Part of speech" error={saveForm.formState.errors.partOfSpeech?.message}>
              <input id="ai-pos" disabled={isSaving} className={formInputClass(Boolean(saveForm.formState.errors.partOfSpeech))} aria-invalid={Boolean(saveForm.formState.errors.partOfSpeech)} {...saveForm.register('partOfSpeech')} />
            </FormField>

            <FormField id="ai-example" label="Example sentence" error={saveForm.formState.errors.exampleSentence?.message}>
              <textarea id="ai-example" disabled={isSaving} className="min-h-24 w-full rounded-button border border-input bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60" aria-invalid={Boolean(saveForm.formState.errors.exampleSentence)} {...saveForm.register('exampleSentence')} />
            </FormField>

            <FormField id="ai-note" label="Note" error={saveForm.formState.errors.note?.message} hint="Synonyms, antonyms, difficulty, and AI explanation are preserved here by default.">
              <textarea id="ai-note" disabled={isSaving} className="min-h-32 w-full rounded-button border border-input bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60" aria-invalid={Boolean(saveForm.formState.errors.note)} {...saveForm.register('note')} />
            </FormField>

            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="text-sm font-semibold text-foreground">Collections</p>
              <p className="mt-1 text-sm text-muted-foreground">Optional. Save this vocabulary into one or more collections.</p>
              {collectionsQuery.isLoading ? (
                <p className="mt-4 text-sm text-muted-foreground">Loading collections...</p>
              ) : collections.length ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {collections.map((collection) => (
                    <label key={collection.id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 text-sm">
                      <input type="checkbox" value={String(collection.id)} disabled={isSaving} className="h-4 w-4 accent-primary" {...saveForm.register('collectionIds')} />
                      <span className="truncate">{getCollectionTitle(collection)}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">No collections available yet. You can still save the vocabulary.</p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={handleReset} disabled={isSaving}><FiRefreshCw aria-hidden="true" /> Reset</Button>
              <Button type="submit" disabled={isSaving}><FiSave aria-hidden="true" /> {isSaving ? 'Saving...' : 'Save vocabulary'}</Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-card border border-border bg-card p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><FiBookOpen aria-hidden="true" /></div>
          <h2 className="mt-4 text-xl font-semibold">Vocabulary-first workflow</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">AI normalize creates editable vocabulary data only. Roleplay and shadowing are intentionally not implemented in this step.</p>
        </div>
        <div className="rounded-card border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold">Security boundary</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">The frontend sends only raw text and reviewed vocabulary fields to the authenticated backend. No API key or user identity fields are exposed.</p>
        </div>
      </section>
    </ResponsiveContentContainer>
  )
}

