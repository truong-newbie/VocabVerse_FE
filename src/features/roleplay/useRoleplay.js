import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { roleplayService } from './roleplay.service'

export const roleplayQueryKeys = {
  all: ['roleplay'],
  sessions: (params) => ['roleplay', 'sessions', params],
  session: (sessionId) => ['roleplay', 'sessions', sessionId],
}

const roleplayStaleTime = 30 * 1000

export function useRoleplaySessions(params = {}) {
  return useQuery({
    queryKey: roleplayQueryKeys.sessions(params),
    queryFn: () => roleplayService.getRoleplaySessions(params),
    staleTime: roleplayStaleTime,
  })
}

export function useRoleplaySession(sessionId, options = {}) {
  return useQuery({
    queryKey: roleplayQueryKeys.session(sessionId),
    queryFn: () => roleplayService.getRoleplaySession(sessionId),
    enabled: Boolean(sessionId) && (options.enabled ?? true),
    staleTime: roleplayStaleTime,
  })
}

export function useCreateRoleplaySession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: roleplayService.createRoleplaySession,
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: roleplayQueryKeys.all })
      const sessionId = session?.sessionId || session?.id
      if (sessionId) {
        queryClient.invalidateQueries({ queryKey: roleplayQueryKeys.session(sessionId) })
      }
    },
  })
}

export function useSendRoleplayMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, message }) => roleplayService.sendRoleplayMessage(sessionId, { message }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: roleplayQueryKeys.session(variables.sessionId) })
    },
  })
}

export function useEndRoleplaySession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: roleplayService.endRoleplaySession,
    onSuccess: (response, sessionId) => {
      queryClient.invalidateQueries({ queryKey: roleplayQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: roleplayQueryKeys.session(sessionId) })
    },
  })
}
