import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { typingService } from './typing.service'

export const typingQueryKeys = {
  all: ['typing'],
  session: (sessionId) => ['typing', 'session', sessionId],
  questions: (sessionId) => ['typing', 'session', sessionId, 'questions'],
}

const typingStaleTime = 30 * 1000

export function useCreateTypingSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: typingService.createTypingSession,
    onSuccess: (session) => {
      const sessionId = session?.sessionId || session?.id
      if (sessionId) {
        queryClient.invalidateQueries({ queryKey: typingQueryKeys.session(sessionId) })
        queryClient.invalidateQueries({ queryKey: typingQueryKeys.questions(sessionId) })
      }
    },
  })
}

export function useTypingSession(sessionId, options = {}) {
  return useQuery({
    queryKey: typingQueryKeys.session(sessionId),
    queryFn: () => typingService.getTypingSession(sessionId),
    enabled: Boolean(sessionId) && (options.enabled ?? true),
    staleTime: typingStaleTime,
  })
}

export function useTypingQuestions(sessionId, options = {}) {
  return useQuery({
    queryKey: typingQueryKeys.questions(sessionId),
    queryFn: () => typingService.getTypingQuestions(sessionId),
    enabled: Boolean(sessionId) && (options.enabled ?? true),
    staleTime: typingStaleTime,
  })
}

export function useSubmitTypingAnswer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, questionId, answer }) => typingService.submitTypingAnswer(sessionId, questionId, { answer }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: typingQueryKeys.session(variables.sessionId) })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['learning'] })
    },
  })
}
