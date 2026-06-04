import { useMutation } from '@tanstack/react-query'
import { aiService } from './ai.service'

export function useNormalizeVocabulary() {
  return useMutation({
    mutationFn: aiService.normalizeVocabulary,
  })
}
