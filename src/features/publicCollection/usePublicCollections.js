import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { publicCollectionService } from './publicCollection.service'

export const publicCollectionQueryKeys = {
  all: ['publicCollections'],
  list: (params) => ['publicCollections', 'list', params],
  detail: (collectionId) => ['publicCollections', 'detail', collectionId],
  vocabularies: (collectionId, params) => ['publicCollections', 'detail', collectionId, 'vocabularies', params],
}

const publicCollectionsStaleTime = 60 * 1000

export function usePublicCollections(params = {}) {
  return useQuery({
    queryKey: publicCollectionQueryKeys.list(params),
    queryFn: () => publicCollectionService.getPublicCollections(params),
    staleTime: publicCollectionsStaleTime,
  })
}

export function usePublicCollection(collectionId, options = {}) {
  return useQuery({
    queryKey: publicCollectionQueryKeys.detail(collectionId),
    queryFn: () => publicCollectionService.getPublicCollectionById(collectionId),
    enabled: Boolean(collectionId) && (options.enabled ?? true),
    staleTime: publicCollectionsStaleTime,
  })
}

export function usePublicCollectionVocabularies(collectionId, params = {}, options = {}) {
  return useQuery({
    queryKey: publicCollectionQueryKeys.vocabularies(collectionId, params),
    queryFn: () => publicCollectionService.getPublicCollectionVocabularies(collectionId, params),
    enabled: Boolean(collectionId) && (options.enabled ?? true),
    staleTime: publicCollectionsStaleTime,
  })
}

export function useClonePublicCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: publicCollectionService.clonePublicCollection,
    onSuccess: (response, collectionId) => {
      queryClient.invalidateQueries({ queryKey: publicCollectionQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: publicCollectionQueryKeys.detail(collectionId) })
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}
