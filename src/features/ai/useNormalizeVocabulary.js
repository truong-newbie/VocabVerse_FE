import { useMutation } from '@tanstack/react-query'
import { aiService } from './ai.service'

export function useNormalizeVocabulary() {
  return useMutation({
    mutationFn: aiService.normalizeVocabulary,
  })
}

export function useNormalizeBulkVocabulary() {
  return useMutation({
    mutationFn: aiService.normalizeBulkVocabulary,
  })
}
