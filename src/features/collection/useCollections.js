import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { collectionService } from './collection.service'

export const collectionQueryKeys = {
  all: ['collections'],
  list: (params) => ['collections', 'list', params],
  detail: (id) => ['collections', 'detail', id],
}

const collectionsStaleTime = 60 * 1000

export function useCollections(params = {}) {
  return useQuery({
    queryKey: collectionQueryKeys.list(params),
    queryFn: () => collectionService.getCollections(params),
    staleTime: collectionsStaleTime,
  })
}

export function useCollection(id, options = {}) {
  return useQuery({
    queryKey: collectionQueryKeys.detail(id),
    queryFn: () => collectionService.getCollectionById(id),
    enabled: Boolean(id) && (options.enabled ?? true),
    staleTime: collectionsStaleTime,
  })
}

export function useCreateCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: collectionService.createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionQueryKeys.all })
    },
  })
}

export function useUpdateCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }) => collectionService.updateCollection(id, payload),
    onSuccess: (collection, variables) => {
      queryClient.invalidateQueries({ queryKey: collectionQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: collectionQueryKeys.detail(variables.id) })
    },
  })
}

export function useDeleteCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: collectionService.deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionQueryKeys.all })
    },
  })
}
