import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reviewService } from './review.service'

export const reviewQueryKeys = {
  all: ['reviews'],
  today: ['reviews', 'today'],
  history: ['reviews', 'history'],
  progress: ['learning', 'progress'],
  vocabularyProgress: (vocabularyId) => ['learning', 'progress', vocabularyId],
}

const reviewStaleTime = 45 * 1000

export function useTodayReviews() {
  return useQuery({
    queryKey: reviewQueryKeys.today,
    queryFn: reviewService.getTodayReviews,
    staleTime: reviewStaleTime,
  })
}

export function useSubmitReviewResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vocabularyId, result }) => reviewService.submitReviewResult(vocabularyId, { result }),
    onSuccess: (progress, variables) => {
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.today })
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
