import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { FiAlertTriangle, FiCheckCircle, FiClock, FiLink, FiUpload, FiVideo } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import DashboardSection from '@/components/dashboard/DashboardSection'
import ErrorFallback from '@/components/common/ErrorFallback'
import PageHeader from '@/components/common/PageHeader'
import ResponsiveContentContainer from '@/components/common/ResponsiveContentContainer'
import StatCard from '@/components/common/StatCard'
import { useAuthStore } from '@/app/store/authStore'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import {
  getShadowingLessonId,
  getStatusBadgeVariant,
  isAdminUser,
} from '@/features/shadowing/shadowingUtils'
import {
  useCreateYoutubeShadowingLesson,
  useShadowingProcessingStatus,
  useUploadShadowingLesson,
} from '@/features/shadowing/useShadowing'

const youtubeSchema = z.object({
  youtubeUrl: z.string().trim().url('Enter a valid YouTube URL').refine((value) => {
    try {
      const url = new URL(value)
      return ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'].includes(url.hostname)
    } catch {
      return false
    }
  }, 'Only YouTube URLs are supported.'),
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
})

function AdminAccessDenied() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader title="Admin Shadowing" description="Admin-only lesson upload and processing tools." />
      <ErrorFallback
        title="Admin access required"
        description="This page is hidden from normal users. Sign in with an admin account to upload or process shadowing lessons."
      />
    </ResponsiveContentContainer>
  )
}

function ProcessingStatusPanel({ lessonId }) {
  const statusQuery = useShadowingProcessingStatus(lessonId, { enabled: Boolean(lessonId) })
  const status = statusQuery.data?.status || 'PROCESSING'
  const progress = Number(statusQuery.data?.progress ?? 0)

  if (!lessonId) {
    return (
      <DashboardSection title="Processing status" description="Upload or create a YouTube lesson to start tracking processing.">
        <div className="rounded-2xl bg-muted p-5 text-sm leading-6 text-muted-foreground">
          No processing lesson selected yet.
        </div>
      </DashboardSection>
    )
  }

  return (
    <DashboardSection
      title="Processing status"
      description="Status is polled while the lesson is PROCESSING."
      actions={<Button variant="secondary" onClick={() => statusQuery.refetch()} disabled={statusQuery.isFetching}>Refresh</Button>}
    >
      {statusQuery.error ? (
        <ErrorFallback title="Unable to load processing status" description={statusQuery.error.message} onRetry={() => statusQuery.refetch()} />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Lesson ID" value={lessonId} icon={FiVideo} tone="primary" />
            <StatCard label="Status" value={status} icon={status === 'FAILED' ? FiAlertTriangle : FiCheckCircle} tone={status === 'FAILED' ? 'destructive' : status === 'PROCESSING' ? 'warning' : 'success'} />
            <StatCard label="Progress" value={`${progress}%`} icon={FiClock} tone="success" />
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} />
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
            {statusQuery.data?.message ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{statusQuery.data.message}</p> : null}
            {statusQuery.data?.error ? <p className="mt-3 text-sm leading-6 text-destructive">{statusQuery.data.error}</p> : null}
          </div>
        </div>
      )}
    </DashboardSection>
  )
}

export default function AdminShadowingPage() {
  const userFromStore = useAuthStore((state) => state.user)
  const currentUserQuery = useCurrentUser()
  const user = currentUserQuery.data || userFromStore
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [processingLessonId, setProcessingLessonId] = useState(null)
  const uploadMutation = useUploadShadowingLesson()
  const youtubeMutation = useCreateYoutubeShadowingLesson()
  const youtubeForm = useForm({
    resolver: zodResolver(youtubeSchema),
    defaultValues: {
      youtubeUrl: '',
      title: '',
      description: '',
    },
  })

  if (currentUserQuery.isLoading && !userFromStore) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <div className="h-40 animate-pulse rounded-card border border-border bg-card" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-card border border-border bg-card" />
          <div className="h-96 animate-pulse rounded-card border border-border bg-card" />
        </div>
      </ResponsiveContentContainer>
    )
  }

  if (!isAdminUser(user)) return <AdminAccessDenied />

  const handleUpload = async (event) => {
    event.preventDefault()
    if (!uploadFile) {
      toast.error('Select an MP4 file before uploading')
      return
    }

    try {
      const lesson = await uploadMutation.mutateAsync({
        file: uploadFile,
        title: uploadTitle.trim(),
        description: uploadDescription.trim(),
      })
      const lessonId = getShadowingLessonId(lesson)
      if (lessonId) setProcessingLessonId(lessonId)
      setUploadFile(null)
      setUploadTitle('')
      setUploadDescription('')
      event.currentTarget.reset()
      toast.success('Shadowing lesson upload started')
    } catch (error) {
      toast.error(error.message || 'Unable to upload shadowing lesson')
    }
  }

  const handleYoutubeSubmit = async (values) => {
    try {
      const lesson = await youtubeMutation.mutateAsync({
        youtubeUrl: values.youtubeUrl.trim(),
        title: values.title?.trim(),
        description: values.description?.trim(),
      })
      const lessonId = getShadowingLessonId(lesson)
      if (lessonId) setProcessingLessonId(lessonId)
      youtubeForm.reset()
      toast.success('YouTube shadowing lesson created')
    } catch (error) {
      toast.error(error.message || 'Unable to create YouTube shadowing lesson')
    }
  }

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Admin tools"
        title="Admin Shadowing"
        description="Upload MP4 lessons or create lessons from YouTube URLs, then track backend processing."
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardSection title="Upload MP4 lesson" description="Send a local MP4 file with optional title and description.">
          <form className="space-y-4" onSubmit={handleUpload}>
            <div>
              <label className="text-sm font-semibold text-foreground" htmlFor="shadowing-upload-title">Title</label>
              <input
                id="shadowing-upload-title"
                className="mt-2 h-11 w-full rounded-button border border-input bg-background px-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                value={uploadTitle}
                onChange={(event) => setUploadTitle(event.target.value)}
                placeholder="Lesson title"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground" htmlFor="shadowing-upload-description">Description</label>
              <textarea
                id="shadowing-upload-description"
                className="mt-2 min-h-24 w-full rounded-button border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                value={uploadDescription}
                onChange={(event) => setUploadDescription(event.target.value)}
                placeholder="Short learning goal or context"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground" htmlFor="shadowing-upload-file">MP4 file</label>
              <input
                id="shadowing-upload-file"
                className="mt-2 block w-full rounded-button border border-input bg-background px-4 py-3 text-sm file:mr-4 file:rounded-button file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-primary-foreground"
                type="file"
                accept="video/mp4"
                onChange={(event) => setUploadFile(event.target.files?.[0] || null)}
              />
            </div>
            <Button className="w-full" type="submit" disabled={uploadMutation.isPending}>
              <FiUpload aria-hidden="true" /> {uploadMutation.isPending ? 'Uploading...' : 'Upload MP4'}
            </Button>
          </form>
        </DashboardSection>

        <DashboardSection title="Create from YouTube" description="Validate a YouTube URL before sending it to the backend.">
          <form className="space-y-4" onSubmit={youtubeForm.handleSubmit(handleYoutubeSubmit)}>
            <div>
              <label className="text-sm font-semibold text-foreground" htmlFor="shadowing-youtube-url">YouTube URL</label>
              <input
                id="shadowing-youtube-url"
                className="mt-2 h-11 w-full rounded-button border border-input bg-background px-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="https://www.youtube.com/watch?v=..."
                {...youtubeForm.register('youtubeUrl')}
              />
              {youtubeForm.formState.errors.youtubeUrl ? <p className="mt-2 text-sm font-semibold text-destructive">{youtubeForm.formState.errors.youtubeUrl.message}</p> : null}
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground" htmlFor="shadowing-youtube-title">Title</label>
              <input
                id="shadowing-youtube-title"
                className="mt-2 h-11 w-full rounded-button border border-input bg-background px-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="Optional title"
                {...youtubeForm.register('title')}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground" htmlFor="shadowing-youtube-description">Description</label>
              <textarea
                id="shadowing-youtube-description"
                className="mt-2 min-h-24 w-full rounded-button border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="Optional description"
                {...youtubeForm.register('description')}
              />
            </div>
            <Button className="w-full" type="submit" disabled={youtubeMutation.isPending}>
              <FiLink aria-hidden="true" /> {youtubeMutation.isPending ? 'Creating...' : 'Create YouTube Lesson'}
            </Button>
          </form>
        </DashboardSection>
      </section>

      <ProcessingStatusPanel lessonId={processingLessonId} />

      <DashboardSection title="Admin security boundary" description="This UI is only rendered for admin roles.">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-muted p-4">
            <FiCheckCircle aria-hidden="true" className="h-5 w-5 text-success" />
            <p className="mt-3 font-semibold">No user id sent</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Admin actions rely on backend auth context.</p>
          </div>
          <div className="rounded-2xl bg-muted p-4">
            <FiCheckCircle aria-hidden="true" className="h-5 w-5 text-success" />
            <p className="mt-3 font-semibold">Multipart upload</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">MP4 upload is sent as FormData through the authenticated API client.</p>
          </div>
          <div className="rounded-2xl bg-muted p-4">
            <FiCheckCircle aria-hidden="true" className="h-5 w-5 text-success" />
            <p className="mt-3 font-semibold">Validated YouTube URL</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">The form rejects non-YouTube URLs before submission.</p>
          </div>
        </div>
      </DashboardSection>
    </ResponsiveContentContainer>
  )
}
