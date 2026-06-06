import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FiLink, FiRefreshCw, FiUpload, FiVideo } from 'react-icons/fi'
import AdminDataTable from '@/components/admin/AdminDataTable'
import AdminPageShell from '@/components/admin/AdminPageShell'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/ui/Button'
import { extractList, extractTotalPages, formatDate, getId } from '@/features/admin/adminUtils'
import {
  useAdminCreateYoutubeShadowingLesson,
  useAdminShadowingLessons,
  useAdminShadowingProcessingStatus,
  useAdminUploadShadowingLesson,
} from '@/features/admin/useAdmin'

const pageSize = 10

function isYoutubeUrl(value) {
  try {
    const url = new URL(value)
    return ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'].includes(url.hostname)
  } catch {
    return false
  }
}

export default function AdminShadowingPage() {
  const [page, setPage] = useState(0)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [youtubeTitle, setYoutubeTitle] = useState('')
  const [youtubeDescription, setYoutubeDescription] = useState('')
  const [processingLessonId, setProcessingLessonId] = useState(null)
  const lessonsQuery = useAdminShadowingLessons({ page, size: pageSize })
  const uploadMutation = useAdminUploadShadowingLesson()
  const youtubeMutation = useAdminCreateYoutubeShadowingLesson()
  const statusQuery = useAdminShadowingProcessingStatus(processingLessonId, { enabled: Boolean(processingLessonId) })
  const lessons = extractList(lessonsQuery.data, ['lessons', 'videos'])
  const totalPages = extractTotalPages(lessonsQuery.data, pageSize)

  const columns = useMemo(() => [
    { key: 'title', header: 'Lesson', render: (lesson) => <span className="font-semibold text-white">{lesson.title || lesson.name || `Lesson ${getId(lesson) || ''}`}</span> },
    { key: 'sourceType', header: 'Source', render: (lesson) => lesson.sourceType || lesson.source || (lesson.youtubeUrl ? 'YOUTUBE' : 'UPLOAD') },
    { key: 'status', header: 'Status', render: (lesson) => <StatusBadge status={lesson.status || 'PENDING'} /> },
    { key: 'duration', header: 'Duration', render: (lesson) => lesson.duration || '—' },
    { key: 'createdAt', header: 'Created At', render: (lesson) => formatDate(lesson.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (lesson) => <Button size="sm" variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setProcessingLessonId(getId(lesson))}>Track status</Button>,
    },
  ], [])

  const handleUpload = async (event) => {
    event.preventDefault()
    if (!uploadFile) {
      toast.error('Select an MP4 file before uploading')
      return
    }
    if (uploadFile.type && uploadFile.type !== 'video/mp4') {
      toast.error('Only MP4 uploads are supported')
      return
    }

    try {
      const lesson = await uploadMutation.mutateAsync({ file: uploadFile, title: uploadTitle.trim(), description: uploadDescription.trim() })
      setProcessingLessonId(getId(lesson))
      setUploadFile(null)
      setUploadTitle('')
      setUploadDescription('')
      event.currentTarget.reset()
      toast.success('Shadowing upload started')
    } catch (error) {
      toast.error(error.message || 'Unable to upload MP4')
    }
  }

  const handleYoutubeSubmit = async (event) => {
    event.preventDefault()
    if (!isYoutubeUrl(youtubeUrl.trim())) {
      toast.error('Enter a valid YouTube URL')
      return
    }

    try {
      const lesson = await youtubeMutation.mutateAsync({ youtubeUrl: youtubeUrl.trim(), title: youtubeTitle.trim(), description: youtubeDescription.trim() })
      setProcessingLessonId(getId(lesson))
      setYoutubeUrl('')
      setYoutubeTitle('')
      setYoutubeDescription('')
      toast.success('YouTube lesson created')
    } catch (error) {
      toast.error(error.message || 'Unable to create YouTube lesson')
    }
  }

  return (
    <AdminPageShell
      eyebrow="Media operations"
      title="Shadowing Management"
      description="Upload MP4 lessons, create lessons from YouTube URLs, and track processing states: PENDING, PROCESSING, COMPLETED, FAILED."
      error={lessonsQuery.error}
      onRetry={() => lessonsQuery.refetch()}
      actions={<Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => lessonsQuery.refetch()}><FiRefreshCw aria-hidden="true" /> Refresh</Button>}
    >
      <section className="grid gap-5 lg:grid-cols-2">
        <form className="rounded-2xl border border-white/10 bg-white/[0.035] p-5" onSubmit={handleUpload}>
          <div className="flex items-center gap-3"><FiUpload className="text-cyan-300" aria-hidden="true" /><h2 className="text-lg font-semibold text-white">Upload MP4</h2></div>
          <input className="mt-5 h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none" value={uploadTitle} onChange={(event) => setUploadTitle(event.target.value)} placeholder="Lesson title" />
          <textarea className="mt-3 min-h-24 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none" value={uploadDescription} onChange={(event) => setUploadDescription(event.target.value)} placeholder="Description" />
          <input className="mt-3 block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:font-bold file:text-slate-950" type="file" accept="video/mp4" onChange={(event) => setUploadFile(event.target.files?.[0] || null)} />
          <Button className="mt-4 w-full" type="submit" disabled={uploadMutation.isPending}>{uploadMutation.isPending ? 'Uploading...' : 'Upload lesson'}</Button>
        </form>

        <form className="rounded-2xl border border-white/10 bg-white/[0.035] p-5" onSubmit={handleYoutubeSubmit}>
          <div className="flex items-center gap-3"><FiLink className="text-cyan-300" aria-hidden="true" /><h2 className="text-lg font-semibold text-white">Create from YouTube</h2></div>
          <input className="mt-5 h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none" value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          <input className="mt-3 h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none" value={youtubeTitle} onChange={(event) => setYoutubeTitle(event.target.value)} placeholder="Optional title" />
          <textarea className="mt-3 min-h-24 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none" value={youtubeDescription} onChange={(event) => setYoutubeDescription(event.target.value)} placeholder="Optional description" />
          <Button className="mt-4 w-full" type="submit" disabled={youtubeMutation.isPending}>{youtubeMutation.isPending ? 'Creating...' : 'Create lesson'}</Button>
        </form>
      </section>

      {processingLessonId ? (
        <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-center gap-3"><FiVideo className="text-cyan-300" aria-hidden="true" /><h2 className="text-lg font-semibold text-white">Processing status</h2></div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.16em] text-slate-500">Lesson ID</p><p className="mt-2 text-sm font-semibold text-white">{processingLessonId}</p></div>
            <div className="rounded-xl bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.16em] text-slate-500">Status</p><div className="mt-2"><StatusBadge status={statusQuery.data?.status || 'PROCESSING'} /></div></div>
            <div className="rounded-xl bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.16em] text-slate-500">Progress</p><p className="mt-2 text-sm font-semibold text-white">{Number(statusQuery.data?.progress ?? 0)}%</p></div>
          </div>
          {statusQuery.error ? <p className="mt-4 text-sm text-rose-200">{statusQuery.error.message}</p> : null}
          {statusQuery.data?.message ? <p className="mt-4 text-sm text-slate-400">{statusQuery.data.message}</p> : null}
        </section>
      ) : null}

      <AdminDataTable
        className="mt-5"
        columns={columns}
        rows={lessons}
        isLoading={lessonsQuery.isLoading}
        emptyTitle="No shadowing lessons"
        emptyDescription="Upload an MP4 or create a YouTube lesson to start processing content."
        getRowKey={getId}
        pagination={{ page, totalPages, isLastPage: page + 1 >= totalPages || lessons.length < pageSize, onPageChange: setPage }}
      />
    </AdminPageShell>
  )
}
