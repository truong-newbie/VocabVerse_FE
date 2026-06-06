import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService } from './admin.service'

export const adminQueryKeys = {
  all: ['admin'],
  dashboard: () => ['admin', 'dashboard'],
  users: (params) => ['admin', 'users', params],
  collections: (params) => ['admin', 'collections', params],
  publicCollections: (params) => ['admin', 'public-collections', params],
  publicCollectionVocabulary: (id, params) => ['admin', 'public-collections', id, 'vocabularies', params],
  shadowingLessons: (params) => ['admin', 'shadowing', 'lessons', params],
  shadowingStatus: (id) => ['admin', 'shadowing', 'status', id],
  notifications: (params) => ['admin', 'notifications', params],
  systemHealth: () => ['admin', 'system', 'health'],
}

const staleTime = 45 * 1000

export function useAdminDashboardStats() {
  return useQuery({ queryKey: adminQueryKeys.dashboard(), queryFn: adminService.getDashboardStats, staleTime })
}

export function useAdminUsers(params = {}) {
  return useQuery({ queryKey: adminQueryKeys.users(params), queryFn: () => adminService.getUsers(params), staleTime })
}

export function useUpdateAdminUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }) => adminService.updateUserRole(userId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.all }),
  })
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, status }) => adminService.updateUserStatus(userId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.all }),
  })
}

export function useAdminCollections(params = {}) {
  return useQuery({ queryKey: adminQueryKeys.collections(params), queryFn: () => adminService.getCollections(params), staleTime })
}

export function useDeleteAdminCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminService.deleteCollection,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.all }),
  })
}

export function useModerateAdminCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ collectionId, payload }) => adminService.moderateCollection(collectionId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.all }),
  })
}

export function useAdminPublicCollections(params = {}) {
  return useQuery({ queryKey: adminQueryKeys.publicCollections(params), queryFn: () => adminService.getPublicCollections(params), staleTime })
}

export function useAdminPublicCollectionVocabulary(collectionId, params = {}, options = {}) {
  return useQuery({
    queryKey: adminQueryKeys.publicCollectionVocabulary(collectionId, params),
    queryFn: () => adminService.getPublicCollectionVocabulary(collectionId, params),
    enabled: Boolean(collectionId) && (options.enabled ?? true),
    staleTime,
  })
}

export function useHideAdminPublicCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ collectionId, reason }) => adminService.hidePublicCollection(collectionId, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.all }),
  })
}

export function useAdminShadowingLessons(params = {}) {
  return useQuery({ queryKey: adminQueryKeys.shadowingLessons(params), queryFn: () => adminService.getShadowingLessons(params), staleTime })
}

export function useAdminUploadShadowingLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminService.uploadShadowingLesson,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.all }),
  })
}

export function useAdminCreateYoutubeShadowingLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminService.createYoutubeShadowingLesson,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.all }),
  })
}

export function useAdminShadowingProcessingStatus(lessonId, options = {}) {
  return useQuery({
    queryKey: adminQueryKeys.shadowingStatus(lessonId),
    queryFn: () => adminService.getShadowingProcessingStatus(lessonId),
    enabled: Boolean(lessonId) && (options.enabled ?? true),
    refetchInterval: (query) => (query.state.data?.status === 'PROCESSING' ? 5000 : false),
  })
}

export function useAdminNotifications(params = {}) {
  return useQuery({ queryKey: adminQueryKeys.notifications(params), queryFn: () => adminService.getNotifications(params), staleTime })
}

export function useAdminSystemHealth() {
  return useQuery({ queryKey: adminQueryKeys.systemHealth(), queryFn: adminService.getSystemHealth, staleTime: 15 * 1000 })
}
