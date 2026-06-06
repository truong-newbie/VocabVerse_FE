import { useQuery } from '@tanstack/react-query'
import { shadowingService } from './shadowing.service'

export const shadowingQueryKeys = {
  all: ['shadowing'],
  lessons: (params) => ['shadowing', 'lessons', params],
  lesson: (lessonId) => ['shadowing', 'lessons', lessonId],
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
