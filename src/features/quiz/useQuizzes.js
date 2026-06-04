import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { quizService } from './quiz.service'

export const quizQueryKeys = {
  all: ['quizzes'],
  session: (sessionId) => ['quizzes', 'session', sessionId],
  questions: (sessionId) => ['quizzes', 'session', sessionId, 'questions'],
}

const quizStaleTime = 30 * 1000

export function useCreateQuizSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: quizService.createQuizSession,
    onSuccess: (session) => {
      const sessionId = session?.sessionId || session?.id
      if (sessionId) {
        queryClient.invalidateQueries({ queryKey: quizQueryKeys.session(sessionId) })
        queryClient.invalidateQueries({ queryKey: quizQueryKeys.questions(sessionId) })
      }
    },
  })
}

export function useQuizSession(sessionId, options = {}) {
  return useQuery({
    queryKey: quizQueryKeys.session(sessionId),
    queryFn: () => quizService.getQuizSession(sessionId),
    enabled: Boolean(sessionId) && (options.enabled ?? true),
    staleTime: quizStaleTime,
  })
}

export function useQuizQuestions(sessionId, options = {}) {
  return useQuery({
    queryKey: quizQueryKeys.questions(sessionId),
    queryFn: () => quizService.getQuizQuestions(sessionId),
    enabled: Boolean(sessionId) && (options.enabled ?? true),
    staleTime: quizStaleTime,
  })
}

export function useSubmitQuizAnswer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, questionId, answer }) => quizService.submitQuizAnswer(sessionId, questionId, { answer }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: quizQueryKeys.session(variables.sessionId) })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['learning'] })
    },
  })
}
