import { useQuery } from '@tanstack/react-query'
import { dictionaryApi } from './dictionaryApi'

function normalizeSearchTerm(word) {
  return word.trim().toLowerCase()
}

export const dictionaryQueryKeys = {
  all: ['dictionary'],
  search: (word) => ['dictionary', 'search', normalizeSearchTerm(word)],
}

export function useDictionarySearch(word, options = {}) {
  const normalizedWord = normalizeSearchTerm(word || '')

  return useQuery({
    queryKey: dictionaryQueryKeys.search(normalizedWord),
    queryFn: () => dictionaryApi.searchWord(normalizedWord),
    enabled: Boolean(normalizedWord) && (options.enabled ?? true),
    retry: 1,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}
