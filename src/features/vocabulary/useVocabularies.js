import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { vocabularyService } from './vocabulary.service'

export const vocabularyQueryKeys = {
  all: ['vocabularies'],
  list: (params) => ['vocabularies', 'list', params],
  detail: (id) => ['vocabularies', 'detail', id],
  collectionList: (collectionId, params) => ['vocabularies', 'collection', collectionId, params],
}

const vocabulariesStaleTime = 60 * 1000

export function useVocabularies(params = {}, options = {}) {
  return useQuery({
    queryKey: vocabularyQueryKeys.list(params),
    queryFn: () => vocabularyService.getVocabularies(params),
    enabled: options.enabled ?? true,
    staleTime: vocabulariesStaleTime,
  })
}

export function useVocabulary(id, options = {}) {
  return useQuery({
    queryKey: vocabularyQueryKeys.detail(id),
    queryFn: () => vocabularyService.getVocabularyById(id),
    enabled: Boolean(id) && (options.enabled ?? true),
    staleTime: vocabulariesStaleTime,
  })
}

export function useCollectionVocabularies(collectionId, params = {}, options = {}) {
  return useQuery({
    queryKey: vocabularyQueryKeys.collectionList(collectionId, params),
    queryFn: () => vocabularyService.getCollectionVocabularies(collectionId, params),
    enabled: Boolean(collectionId) && (options.enabled ?? true),
    staleTime: vocabulariesStaleTime,
  })
}

export function useCreateVocabulary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: vocabularyService.createVocabulary,
    onSuccess: (vocabulary, variables) => {
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.all })
      if (variables?.collectionIds?.length) {
        queryClient.invalidateQueries({ queryKey: ['collections'] })
      }
    },
  })
}

export function useUpdateVocabulary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }) => vocabularyService.updateVocabulary(id, payload),
    onSuccess: (vocabulary, variables) => {
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.detail(variables.id) })
    },
  })
}

export function useDeleteVocabulary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: vocabularyService.deleteVocabulary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.all })
    },
  })
}

export function useAddVocabularyToCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ collectionId, vocabularyId }) => vocabularyService.addVocabularyToCollection(collectionId, vocabularyId),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.detail(variables.vocabularyId) })
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useRemoveVocabularyFromCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ collectionId, vocabularyId }) => vocabularyService.removeVocabularyFromCollection(collectionId, vocabularyId),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.detail(variables.vocabularyId) })
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useBulkCreateCollectionVocabularies() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ collectionId, vocabularies }) => vocabularyService.bulkCreateCollectionVocabularies(collectionId, { vocabularies }),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      queryClient.invalidateQueries({ queryKey: ['vocabularies', 'collection', variables.collectionId] })
    },
  })
}
