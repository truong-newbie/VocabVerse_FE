import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reviewService } from './review.service'

export const reviewQueryKeys = {
  all: ['reviews'],
  today: ['reviews', 'today'],
  stats: ['reviews', 'stats'],
  history: ['reviews', 'history'],
  progress: ['learning', 'progress'],
  vocabularyProgress: (vocabularyId) => ['learning', 'progress', vocabularyId],
  collectionSettings: (collectionId) => ['reviews', 'collection-settings', collectionId],
}

const reviewStaleTime = 45 * 1000

export function useTodayReviews() {
  return useQuery({
    queryKey: reviewQueryKeys.today,
    queryFn: reviewService.getTodayReviews,
    staleTime: reviewStaleTime,
  })
}

export function useReviewStats() {
  return useQuery({
    queryKey: reviewQueryKeys.stats,
    queryFn: reviewService.getReviewStats,
    staleTime: reviewStaleTime,
  })
}

export function useSubmitReviewResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vocabularyId, result }) => reviewService.submitReviewResult(vocabularyId, { result }),
    onSuccess: (progress, variables) => {
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.today })
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.stats })
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.history })
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.progress })
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.vocabularyProgress(variables.vocabularyId) })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useReviewHistory() {
  return useQuery({
    queryKey: reviewQueryKeys.history,
    queryFn: reviewService.getReviewHistory,
    staleTime: reviewStaleTime,
  })
}

export function useLearningProgress() {
  return useQuery({
    queryKey: reviewQueryKeys.progress,
    queryFn: reviewService.getLearningProgress,
    staleTime: reviewStaleTime,
  })
}

export function useVocabularyProgress(vocabularyId, options = {}) {
  return useQuery({
    queryKey: reviewQueryKeys.vocabularyProgress(vocabularyId),
    queryFn: () => reviewService.getVocabularyProgress(vocabularyId),
    enabled: Boolean(vocabularyId) && (options.enabled ?? true),
    staleTime: reviewStaleTime,
  })
}

export function useCollectionReviewSettings(collectionId, options = {}) {
  return useQuery({
    queryKey: reviewQueryKeys.collectionSettings(collectionId),
    queryFn: () => reviewService.getCollectionReviewSettings(collectionId),
    enabled: Boolean(collectionId) && (options.enabled ?? true),
    staleTime: reviewStaleTime,
  })
}

function invalidateReviewSettingsQueries(queryClient, collectionId) {
  queryClient.invalidateQueries({ queryKey: reviewQueryKeys.collectionSettings(collectionId) })
  queryClient.invalidateQueries({ queryKey: reviewQueryKeys.today })
  queryClient.invalidateQueries({ queryKey: reviewQueryKeys.stats })
  queryClient.invalidateQueries({ queryKey: reviewQueryKeys.progress })
  queryClient.invalidateQueries({ queryKey: ['collections'] })
  queryClient.invalidateQueries({ queryKey: ['dashboard'] })
}

export function useUpdateCollectionReviewSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ collectionId, payload }) => reviewService.updateCollectionReviewSettings(collectionId, payload),
    onSuccess: (settings, variables) => {
      invalidateReviewSettingsQueries(queryClient, variables.collectionId)
    },
  })
}

export function useDisableCollectionReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ collectionId }) => reviewService.disableCollectionReview(collectionId),
    onSuccess: (result, variables) => {
      invalidateReviewSettingsQueries(queryClient, variables.collectionId)
    },
  })
}

export function useResetCollectionReviewSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ collectionId }) => reviewService.resetCollectionReviewSchedule(collectionId),
    onSuccess: (result, variables) => {
      invalidateReviewSettingsQueries(queryClient, variables.collectionId)
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.history })
    },
  })
}
