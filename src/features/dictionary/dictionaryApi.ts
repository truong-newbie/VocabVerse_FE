import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

export type DictionarySearchPayload = unknown

export async function searchWord(word: string): Promise<DictionarySearchPayload> {
  const normalizedWord = word.trim().toLowerCase()
  const response = await apiClient.get('/dictionary/search', {
    params: { word: normalizedWord },
    timeout: 12000,
  })
  return unwrapApiResponse(response)
}

export const dictionaryApi = {
  searchWord,
}
