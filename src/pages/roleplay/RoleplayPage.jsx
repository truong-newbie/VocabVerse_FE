import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  FiArrowLeft,
  FiAward,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMessageCircle,
  FiPlay,
  FiRefreshCw,
  FiUser,
} from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import ErrorFallback from '@/components/common/ErrorFallback'
import PageHeader from '@/components/common/PageHeader'
import ResponsiveContentContainer from '@/components/common/ResponsiveContentContainer'
import StatCard from '@/components/common/StatCard'
import DashboardSection from '@/components/dashboard/DashboardSection'
import ConversationPanel from '@/features/roleplay/components/ConversationPanel'
import DifficultyBadge from '@/features/roleplay/components/DifficultyBadge'
import PersonaSelector from '@/features/roleplay/components/PersonaSelector'
import RoleplayReportCard from '@/features/roleplay/components/RoleplayReportCard'
import RoleplaySidebar from '@/features/roleplay/components/RoleplaySidebar'
import TopicSelector from '@/features/roleplay/components/TopicSelector'
import {
  extractMessagesFromSendResponse,
  formatRoleplayDate,
  getReportScore,
  getRoleplaySessionId,
  getScenarioDescription,
  getSessionReport,
  normalizeRoleplayMessages,
  normalizeRoleplaySessionList,
  ROLEPLAY_PAGE_SIZE,
  roleplayDifficulties,
  roleplayPersonas,
  roleplayTopics,
} from '@/features/roleplay/roleplayUtils'
import {
  useCreateRoleplaySession,
  useEndRoleplaySession,
  useRoleplaySession,
  useRoleplaySessions,
  useSendRoleplayMessage,
} from '@/features/roleplay/useRoleplay'

const createSessionSchema = z.object({
  topic: z.enum(roleplayTopics),
  difficulty: z.enum(roleplayDifficulties),
  persona: z.enum(roleplayPersonas),
})

function RoleplaySkeleton() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="h-4 w-36 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded-full bg-muted" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="h-[680px] animate-pulse rounded-card border border-border bg-card" />
        <div className="h-[680px] animate-pulse rounded-card border border-border bg-card" />
      </div>
    </ResponsiveContentContainer>
  )
}

function normalizeCreatePayload(values) {
  return {
    topic: values.topic,
    difficulty: values.difficulty,
    persona: values.persona,
  }
}

function SessionHistory({ sessions, page, totalPages, onPageChange, onOpen }) {
  return (
    <DashboardSection title="Session History" description="Review previous roleplay sessions and continue recent practice.">
      {sessions.length ? (
        <div className="space-y-3">
          {sessions.map((session) => {
            const sessionId = getRoleplaySessionId(session)
            const report = getSessionReport(session.report ? session : null)
            const score = getReportScore(report, session)
            return (
              <button
                key={sessionId}
                type="button"
                className="w-full rounded-2xl border border-border bg-background/70 p-4 text-left transition hover:border-primary/50 hover:bg-primary/5"
                onClick={() => onOpen(sessionId)}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{session.topic || 'Roleplay Session'}</h3>
                      <DifficultyBadge difficulty={session.difficulty || 'Beginner'} />
                      <Badge variant="secondary">{session.persona || 'Teacher'}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Completed {formatRoleplayDate(session.completedAt || session.endedAt || session.updatedAt || session.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={session.status === 'ACTIVE' ? 'primary' : 'success'}>{session.status || 'ACTIVE'}</Badge>
                    <Badge variant="muted">Score {score || 'N/A'}</Badge>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <EmptyState icon={FiMessageCircle} title="No roleplay sessions yet" description="Start your first AI conversation to build history and receive feedback." />
      )}

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</p>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page <= 0} onClick={() => onPageChange(Math.max(0, page - 1))}>
            <FiChevronLeft aria-hidden="true" /> Previous
          </Button>
          <Button variant="secondary" disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next <FiChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </DashboardSection>
  )
}

function RoleplaySetupPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const sessionsQuery = useRoleplaySessions({ page, size: ROLEPLAY_PAGE_SIZE })
  const createSession = useCreateRoleplaySession()
  const form = useForm({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      topic: 'Job Interview',
      difficulty: 'Beginner',
      persona: 'Interviewer',
    },
  })
  const values = form.watch()
  const scenarioPreview = getScenarioDescription(values)
  const normalizedSessions = normalizeRoleplaySessionList(sessionsQuery.data, ROLEPLAY_PAGE_SIZE)
  const totalPages = Math.max(1, normalizedSessions.totalPages)

  const handleStart = async (formValues) => {
    try {
      const session = await createSession.mutateAsync(normalizeCreatePayload(formValues))
      const sessionId = getRoleplaySessionId(session)
      if (!sessionId) throw new Error('Roleplay session response did not include a session id')
      toast.success('Roleplay session started')
      navigate(`/roleplay/${sessionId}`)
    } catch (error) {
      toast.error(error.message || 'Unable to start roleplay session')
    }
  }

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="AI conversation practice"
        title="Roleplay"
        description="Create a realistic English scenario, speak with an AI persona, and receive corrections plus an end-of-session report."
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardSection title="Create Session" description="Choose a topic, difficulty, and persona for your AI conversation.">
          <form className="space-y-6" onSubmit={form.handleSubmit(handleStart)}>
            <div>
              <label className="text-sm font-semibold text-foreground">Topic</label>
              <div className="mt-3">
                <Controller name="topic" control={form.control} render={({ field }) => <TopicSelector value={field.value} onChange={field.onChange} />} />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">Difficulty</label>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {roleplayDifficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() => form.setValue('difficulty', difficulty, { shouldValidate: true })}
                    className={`rounded-card border p-4 text-left transition hover:shadow-md ${values.difficulty === difficulty ? 'border-primary bg-primary/5' : 'border-border bg-background/70'}`}
                  >
                    <DifficultyBadge difficulty={difficulty} />
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {difficulty === 'Beginner' ? 'Short, clear replies.' : difficulty === 'Intermediate' ? 'Natural everyday turns.' : 'Complex, high-pressure dialogue.'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">Persona</label>
              <div className="mt-3">
                <Controller name="persona" control={form.control} render={({ field }) => <PersonaSelector value={field.value} onChange={field.onChange} />} />
              </div>
            </div>

            <Button className="w-full" size="lg" type="submit" disabled={createSession.isPending}>
              <FiPlay aria-hidden="true" /> {createSession.isPending ? 'Starting conversation...' : 'Start conversation'}
            </Button>
          </form>
        </DashboardSection>

        <div className="space-y-6">
          <DashboardSection title="Scenario Preview" description="This is the conversation setup sent to the backend.">
            <div className="space-y-4">
              <div className="rounded-[24px] border border-border bg-background/70 p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary">{values.topic}</Badge>
                  <DifficultyBadge difficulty={values.difficulty} />
                  <Badge variant="secondary">{values.persona}</Badge>
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight">Practice with an AI {values.persona}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{scenarioPreview}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard label="Mode" value="Chat" icon={FiMessageCircle} tone="primary" />
                <StatCard label="Difficulty" value={values.difficulty} icon={FiAward} tone="warning" />
                <StatCard label="Persona" value={values.persona} icon={FiUser} tone="success" />
              </div>
            </div>
          </DashboardSection>

          {sessionsQuery.error ? (
            <ErrorFallback title="Unable to load roleplay history" description={sessionsQuery.error.message} onRetry={() => sessionsQuery.refetch()} />
          ) : sessionsQuery.isLoading ? (
            <div className="h-80 animate-pulse rounded-card border border-border bg-card" />
          ) : (
            <SessionHistory
              sessions={normalizedSessions.items}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onOpen={(sessionId) => navigate(`/roleplay/${sessionId}`)}
            />
          )}
        </div>
      </section>
    </ResponsiveContentContainer>
  )
}

function ConversationPage({ sessionId }) {
  const navigate = useNavigate()
  const sessionQuery = useRoleplaySession(sessionId, { enabled: Boolean(sessionId) })
  const sendMessage = useSendRoleplayMessage()
  const endSession = useEndRoleplaySession()
  const [draft, setDraft] = useState('')
  const [localMessages, setLocalMessages] = useState([])
  const [report, setReport] = useState(null)
  const [confirmEnd, setConfirmEnd] = useState(false)

  const session = sessionQuery.data
  const serverMessages = useMemo(() => normalizeRoleplayMessages(session), [session])
  const messages = localMessages.length ? localMessages : serverMessages
  const sessionReport = report || session?.report
  const isEnded = session?.status === 'ENDED' || session?.status === 'COMPLETED' || Boolean(sessionReport)

  const handleSend = async () => {
    const message = draft.trim()
    if (!message || sendMessage.isPending || isEnded) return

    const optimisticUserMessage = {
      id: `local-${Date.now()}`,
      role: 'USER',
      content: message,
      createdAt: new Date().toISOString(),
    }
    const baseMessages = localMessages.length ? localMessages : serverMessages
    setLocalMessages([...baseMessages, optimisticUserMessage])
    setDraft('')

    try {
      const response = await sendMessage.mutateAsync({ sessionId, message })
      const responseMessages = extractMessagesFromSendResponse(response, message)
      if (responseMessages.length) {
        setLocalMessages((current) => {
          const withoutOptimistic = current.filter((item) => item.id !== optimisticUserMessage.id)
          return [...withoutOptimistic, ...responseMessages]
        })
      }
    } catch (error) {
      setLocalMessages(baseMessages)
      setDraft(message)
      toast.error(error.message || 'Unable to send roleplay message')
    }
  }

  const handleEndSession = async () => {
    try {
      const response = await endSession.mutateAsync(sessionId)
      setReport(getSessionReport(response))
      setConfirmEnd(false)
      toast.success('Roleplay session ended')
      sessionQuery.refetch()
    } catch (error) {
      toast.error(error.message || 'Unable to end roleplay session')
    }
  }

  if (sessionQuery.isLoading) return <RoleplaySkeleton />

  if (sessionQuery.error) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader title="Roleplay Session" description="Continue your AI conversation." actions={<Button variant="secondary" onClick={() => navigate('/roleplay')}><FiArrowLeft aria-hidden="true" /> Back</Button>} />
        <ErrorFallback title="Unable to load roleplay session" description={sessionQuery.error.message} onRetry={() => sessionQuery.refetch()} />
      </ResponsiveContentContainer>
    )
  }

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Live conversation"
        title={session?.topic || 'Roleplay Session'}
        description="Chat naturally, read corrections, then end the session to receive an AI report."
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate('/roleplay')}><FiArrowLeft aria-hidden="true" /> Back</Button>
            <Button variant="destructive" onClick={() => setConfirmEnd(true)} disabled={endSession.isPending || isEnded}>
              End Session
            </Button>
          </>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-6">
          <RoleplaySidebar session={session} />
          <DashboardSection title="Session Status" description="Conversation metadata and progress.">
            <div className="grid gap-3">
              <div className="rounded-2xl bg-muted p-4">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="mt-2" variant={isEnded ? 'success' : 'primary'}>{session?.status || 'ACTIVE'}</Badge>
              </div>
              <div className="rounded-2xl bg-muted p-4">
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="mt-1 text-3xl font-bold">{messages.length}</p>
              </div>
              <div className="rounded-2xl bg-muted p-4">
                <p className="text-sm text-muted-foreground">Started</p>
                <p className="mt-1 text-sm font-semibold">{formatRoleplayDate(session?.createdAt)}</p>
              </div>
            </div>
          </DashboardSection>
        </div>

        <ConversationPanel
          messages={messages}
          draft={draft}
          onDraftChange={setDraft}
          onSend={handleSend}
          isSending={sendMessage.isPending}
          isEnded={isEnded}
        />
      </section>

      {sessionReport ? <RoleplayReportCard report={sessionReport} session={session} onNewSession={() => navigate('/roleplay')} /> : null}

      <ConfirmDialog
        open={confirmEnd}
        title="End roleplay session"
        description="End this conversation and request the AI report. You cannot continue sending messages after ending."
        confirmLabel="End Session"
        destructive
        isSubmitting={endSession.isPending}
        onConfirm={handleEndSession}
        onCancel={() => setConfirmEnd(false)}
      />
    </ResponsiveContentContainer>
  )
}

export default function RoleplayPage() {
  const { sessionId } = useParams()
  if (sessionId) return <ConversationPage sessionId={sessionId} />
  return <RoleplaySetupPage />
}
