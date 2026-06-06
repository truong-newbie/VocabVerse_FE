import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FiBookOpen, FiCpu, FiSearch } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/common/EmptyState'
import ErrorFallback from '@/components/common/ErrorFallback'
import PageHeader from '@/components/common/PageHeader'
import ResponsiveContentContainer from '@/components/common/ResponsiveContentContainer'
import { useNormalizeVocabulary } from '@/features/ai/useNormalizeVocabulary'
import { normalizeAiVocabularyResult, isValidAiVocabularyResult } from '@/features/ai/aiUtils'
import { useCollections } from '@/features/collection/useCollections'
import { useCreateVocabulary, useAddVocabularyToCollection } from '@/features/vocabulary/useVocabularies'
import VocabularyFormDialog from '@/features/vocabulary/components/VocabularyFormDialog'
import AddToCollectionDialog from '@/features/dictionary/components/AddToCollectionDialog'
import DictionaryMeaningCard from '@/features/dictionary/components/DictionaryMeaningCard'
import DictionarySearchBar from '@/features/dictionary/components/DictionarySearchBar'
import DictionarySynonymList from '@/features/dictionary/components/DictionarySynonymList'
import DictionaryWordHeader from '@/features/dictionary/components/DictionaryWordHeader'
import { useDictionarySearch } from '@/features/dictionary/useDictionarySearch'
import {
  aiResultToDictionaryVocabulary,
  buildAiNormalizeInput,
  dictionaryToVocabulary,
  getFriendlyDictionaryError,
  normalizeDictionaryResult,
  vocabularyDraftForDialog,
} from '@/features/dictionary/dictionaryUtils'

function normalizeCollectionList(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.content || payload?.items || payload?.data || payload?.collections || []
}

function DictionarySkeleton() {
  return (
    <div className="space-y-5">
      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="h-5 w-36 animate-pulse rounded-full bg-muted" />
        <div className="mt-5 h-14 w-64 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-7 w-40 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-card bg-muted" />
        <div className="h-64 animate-pulse rounded-card bg-muted" />
      </div>
    </div>
  )
}

function EnrichedVocabularyPanel({ result, onSave }) {
  if (!result) return null

  return (
    <section className="rounded-card border border-primary/25 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">AI enriched vocabulary</p>
          <h3 className="mt-2 text-2xl font-semibold">{result.term || result.word}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.meaning || result.meaningEn}</p>
        </div>
        <Button variant="secondary" onClick={onSave}>Review and save</Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {result.partOfSpeech ? <Badge variant="primary">{result.partOfSpeech}</Badge> : null}
        {result.pronunciation || result.phonetic ? <Badge variant="secondary">{result.pronunciation || result.phonetic}</Badge> : null}
        {result.difficulty ? <Badge variant="warning">{result.difficulty}</Badge> : null}
      </div>
      {result.aiExplanation || result.explanation ? <p className="mt-4 rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground">{result.aiExplanation || result.explanation}</p> : null}
    </section>
  )
}

export default function DictionaryPage() {
  const [submittedWord, setSubmittedWord] = useState('')
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false)
  const [savedVocabularyId, setSavedVocabularyId] = useState(null)
  const [enrichedVocabulary, setEnrichedVocabulary] = useState(null)

  const dictionaryQuery = useDictionarySearch(submittedWord, { enabled: Boolean(submittedWord) })
  const collectionsQuery = useCollections({ page: 0, size: 100 })
  const createVocabularyMutation = useCreateVocabulary()
  const addToCollectionMutation = useAddVocabularyToCollection()
  const normalizeMutation = useNormalizeVocabulary()
  const collections = normalizeCollectionList(collectionsQuery.data)

  const dictionaryResult = useMemo(() => normalizeDictionaryResult(dictionaryQuery.data), [dictionaryQuery.data])
  const vocabularyPayload = useMemo(() => {
    if (enrichedVocabulary) return aiResultToDictionaryVocabulary(enrichedVocabulary)
    return dictionaryToVocabulary(dictionaryResult)
  }, [dictionaryResult, enrichedVocabulary])

  const handleSearch = (word) => {
    setSubmittedWord(word)
    setSavedVocabularyId(null)
    setEnrichedVocabulary(null)
    if (word.trim().toLowerCase() === submittedWord.trim().toLowerCase()) {
      dictionaryQuery.refetch()
    }
  }

  const handleSaveVocabulary = async (payload) => {
    try {
      const created = await createVocabularyMutation.mutateAsync(payload)
      setSavedVocabularyId(created?.id || null)
      setSaveDialogOpen(false)
      toast.success('Vocabulary saved for review later')
    } catch (error) {
      toast.error(error.message || 'Unable to save vocabulary')
    }
  }

  const handleAddToCollection = async (collectionId) => {
    try {
      if (savedVocabularyId) {
        await addToCollectionMutation.mutateAsync({ collectionId, vocabularyId: savedVocabularyId })
      } else {
        const created = await createVocabularyMutation.mutateAsync({
          ...vocabularyPayload,
          collectionIds: [collectionId],
        })
        setSavedVocabularyId(created?.id || null)
      }

      setCollectionDialogOpen(false)
      toast.success('Added to collection for review later')
    } catch (error) {
      toast.error(error.message || 'Unable to add vocabulary to collection')
    }
  }

  const handleAiEnrich = async () => {
    if (!dictionaryResult) return

    try {
      const rawResult = await normalizeMutation.mutateAsync(buildAiNormalizeInput(dictionaryResult))
      const parsedResult = normalizeAiVocabularyResult(rawResult)
      if (!isValidAiVocabularyResult(parsedResult)) {
        throw new Error('AI response did not include required vocabulary fields')
      }
      setEnrichedVocabulary(parsedResult)
      toast.success('AI enriched vocabulary is ready')
    } catch (error) {
      toast.error(error.message || 'Unable to enrich this dictionary result')
    }
  }

  const isSearching = dictionaryQuery.isFetching
  const dictionaryError = dictionaryQuery.error ? getFriendlyDictionaryError(dictionaryQuery.error) : null
  const showNotFound = submittedWord && dictionaryQuery.isSuccess && !dictionaryResult
  const isSaving = createVocabularyMutation.isPending
  const isAddingToCollection = createVocabularyMutation.isPending || addToCollectionMutation.isPending

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Dictionary"
        title="Dictionary"
        description="Search English words, hear pronunciation, review examples, and save useful entries to VocabVerse."
      />

      <DictionarySearchBar initialValue={submittedWord} isSearching={isSearching} onSearch={handleSearch} />

      {!submittedWord ? (
        <EmptyState
          icon={FiSearch}
          title="Search for a word to begin learning."
          description="Try abandon, benefit, or maintain to see definitions, pronunciation, examples, synonyms, and save actions."
        />
      ) : null}

      {isSearching ? <DictionarySkeleton /> : null}

      {dictionaryError && !isSearching ? (
        <ErrorFallback title={dictionaryError.title} description={dictionaryError.description} onRetry={() => dictionaryQuery.refetch()} />
      ) : null}

      {showNotFound && !isSearching ? (
        <EmptyState
          icon={FiBookOpen}
          title="No dictionary result found for this word."
          description="Check the spelling or try another English word."
        />
      ) : null}

      {dictionaryResult && !isSearching ? (
        <div className="space-y-6">
          <DictionaryWordHeader
            result={dictionaryResult}
            isAiLoading={normalizeMutation.isPending}
            onSaveVocabulary={() => setSaveDialogOpen(true)}
            onAddToCollection={() => setCollectionDialogOpen(true)}
            onAiEnrich={handleAiEnrich}
          />

          <EnrichedVocabularyPanel result={enrichedVocabulary} onSave={() => setSaveDialogOpen(true)} />

          <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              {dictionaryResult.meanings.map((meaning, index) => (
                <DictionaryMeaningCard key={`${meaning.partOfSpeech}-${index}`} meaning={meaning} />
              ))}
            </div>

            <div className="space-y-4">
              <DictionarySynonymList title="Synonyms" words={dictionaryResult.synonyms} emptyLabel="No synonyms returned for this word." variant="success" />
              <DictionarySynonymList title="Antonyms" words={dictionaryResult.antonyms} emptyLabel="No antonyms returned for this word." variant="warning" />
              <section className="rounded-card border border-border bg-card p-5 shadow-sm">
                <h3 className="text-xl font-semibold">Examples</h3>
                {dictionaryResult.examples.length ? (
                  <div className="mt-4 space-y-3">
                    {dictionaryResult.examples.map((example) => (
                      <p key={example} className="rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground">{example}</p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">No examples returned for this word.</p>
                )}
              </section>
            </div>
          </section>
        </div>
      ) : null}

      <VocabularyFormDialog
        open={saveDialogOpen}
        mode="create"
        vocabulary={vocabularyDraftForDialog(vocabularyPayload)}
        collections={collections}
        isSubmitting={isSaving}
        onSubmit={handleSaveVocabulary}
        onClose={() => setSaveDialogOpen(false)}
      />

      <AddToCollectionDialog
        open={collectionDialogOpen}
        collections={collections}
        isSubmitting={isAddingToCollection}
        onSubmit={handleAddToCollection}
        onClose={() => setCollectionDialogOpen(false)}
      />
    </ResponsiveContentContainer>
  )
}
