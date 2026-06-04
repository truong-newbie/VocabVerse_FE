import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { shadowingService } from './shadowing.service'

export const shadowingQueryKeys = {
  all: ['shadowing'],
  lessons: (params) => ['shadowing', 'lessons', params],
  lesson: (lessonId) => ['shadowing', 'lessons', lessonId],
  processingStatus: (lessonId) => ['shadowing', 'admin', 'status', lessonId],
}

const shadowingStaleTime = 60 * 1000

export function useShadowingLessons(params = {}) {
  return useQuery({
    queryKey: shadowingQueryKeys.lessons(params),
    queryFn: () => shadowingService.getShadowingLessons(params),
    staleTime: shadowingStaleTime,
  })
}

export function useShadowingLesson(lessonId, options = {}) {
  return useQuery({
    queryKey: shadowingQueryKeys.lesson(lessonId),
    queryFn: () => shadowingService.getShadowingLessonById(lessonId),
    enabled: Boolean(lessonId) && (options.enabled ?? true),
    staleTime: shadowingStaleTime,
  })
}

export function useUploadShadowingLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: shadowingService.uploadShadowingLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shadowingQueryKeys.all })
    },
  })
}

export function useCreateYoutubeShadowingLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: shadowingService.createYoutubeShadowingLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shadowingQueryKeys.all })
    },
  })
}

export function useShadowingProcessingStatus(lessonId, options = {}) {
  return useQuery({
    queryKey: shadowingQueryKeys.processingStatus(lessonId),
    queryFn: () => shadowingService.getShadowingProcessingStatus(lessonId),
    enabled: Boolean(lessonId) && (options.enabled ?? true),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'PROCESSING' ? 5000 : false
    },
  })
}
