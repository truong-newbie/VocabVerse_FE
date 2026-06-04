import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { flashcardService } from './flashcard.service'

export const flashcardQueryKeys = {
  all: ['flashcards'],
  session: (sessionId) => ['flashcards', 'session', sessionId],
  cards: (sessionId) => ['flashcards', 'session', sessionId, 'cards'],
}

export function useCreateFlashcardSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: flashcardService.createFlashcardSession,
    onSuccess: (session) => {
      const sessionId = session?.sessionId || session?.id
      if (sessionId) {
        queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.session(sessionId) })
        queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.cards(sessionId) })
      }
    },
  })
}

export function useFlashcardSession(sessionId, options = {}) {
  return useQuery({
    queryKey: flashcardQueryKeys.session(sessionId),
    queryFn: () => flashcardService.getFlashcardSession(sessionId),
    enabled: Boolean(sessionId) && (options.enabled ?? true),
    staleTime: 30 * 1000,
  })
}

export function useFlashcardCards(sessionId, options = {}) {
  return useQuery({
    queryKey: flashcardQueryKeys.cards(sessionId),
    queryFn: () => flashcardService.getFlashcardCards(sessionId),
    enabled: Boolean(sessionId) && (options.enabled ?? true),
    staleTime: 30 * 1000,
  })
}

export function useSubmitFlashcardAnswer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, vocabularyId, result }) => flashcardService.submitFlashcardAnswer(sessionId, vocabularyId, { result }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: flashcardQueryKeys.session(variables.sessionId) })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['learning'] })
    },
  })
}
