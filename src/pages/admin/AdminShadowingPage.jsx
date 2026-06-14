import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FiCpu, FiEdit3, FiRefreshCw, FiSave, FiTrash2, FiUpload, FiVideo } from 'react-icons/fi'
import AdminDataTable from '@/components/admin/AdminDataTable'
import AdminPageShell from '@/components/admin/AdminPageShell'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/ui/Button'
import { extractList, extractTotalPages, formatDate, getId } from '@/features/admin/adminUtils'
import {
  useAdminShadowingLessons,
  useAdminShadowingProcessingStatus,
  useAdminShadowingSubtitles,
  useAdminUploadShadowingLesson,
  useCreateAdminShadowingSubtitle,
  useDeleteAdminShadowingSubtitle,
  useGenerateAiAdminShadowingSubtitles,
  useImportAdminShadowingSubtitles,
  useUpdateAdminShadowingSubtitle,
} from '@/features/admin/useAdmin'

const pageSize = 20
const emptySubtitleForm = {
  startTimeMs: '',
  endTimeMs: '',
  englishText: '',
  vietnameseText: '',
  orderIndex: '',
}
const importExample = JSON.stringify({
  replaceExisting: true,
  items: [
    {
      startTimeMs: 1200,
      endTimeMs: 4300,
      englishText: 'I want to improve my speaking.',
      vietnameseText: 'Toi muon cai thien kha nang noi cua minh.',
      orderIndex: 0,
    },
  ],
}, null, 2)

function normalizeSubtitleList(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.content || payload?.items || payload?.data || payload?.subtitles || []
}

function getLessonTitle(lesson) {
  return lesson?.title || lesson?.name || 'Lesson ' + (getId(lesson) || '')
}

function getLessonVideoUrl(lesson) {
  return lesson?.videoUrl || lesson?.videoURL || lesson?.video_url || lesson?.mediaUrl || lesson?.mediaURL || lesson?.url || ''
}

function getLessonThumbnailUrl(lesson) {
  return lesson?.thumbnailUrl || lesson?.thumbnailURL || lesson?.thumbnail_url || lesson?.posterUrl || lesson?.posterURL || ''
}

function getSubtitleId(subtitle) {
  return subtitle?.id ?? subtitle?.subtitleId
}

function formatMs(value) {
  const totalMs = Number(value ?? 0)
  if (!Number.isFinite(totalMs)) return '0:00.000'
  const minutes = Math.floor(totalMs / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)
  const ms = Math.floor(totalMs % 1000)
  return minutes + ':' + String(seconds).padStart(2, '0') + '.' + String(ms).padStart(3, '0')
}

function normalizeSubtitlePayload(item, fallbackOrderIndex = 0) {
  const startTimeMs = Number(item.startTimeMs)
  const endTimeMs = Number(item.endTimeMs)
  const orderIndex = item.orderIndex === undefined || item.orderIndex === null || item.orderIndex === ''
    ? fallbackOrderIndex
    : Number(item.orderIndex)
  const englishText = String(item.englishText || '').trim()
  const vietnameseText = String(item.vietnameseText || '').trim()

  if (!Number.isFinite(startTimeMs) || !Number.isFinite(endTimeMs)) throw new Error('Start and end time must be numbers in milliseconds')
  if (endTimeMs <= startTimeMs) throw new Error('endTimeMs must be greater than startTimeMs')
  if (!englishText) throw new Error('englishText is required')
  if (!Number.isFinite(orderIndex)) throw new Error('orderIndex must be a number')

  return {
    startTimeMs,
    endTimeMs,
    englishText,
    vietnameseText,
    orderIndex,
  }
}

function buildSubtitlePayload(form, fallbackOrderIndex = 0) {
  const startTimeMs = Number(form.startTimeMs)
  const endTimeMs = Number(form.endTimeMs)
  const orderIndex = form.orderIndex === '' ? fallbackOrderIndex : Number(form.orderIndex)
  if (!Number.isFinite(startTimeMs) || !Number.isFinite(endTimeMs)) throw new Error('Start and end time must be numbers in milliseconds')
  if (endTimeMs <= startTimeMs) throw new Error('endTimeMs must be greater than startTimeMs')
  if (!form.englishText.trim()) throw new Error('englishText is required')
  if (!Number.isFinite(orderIndex)) throw new Error('orderIndex must be a number')

  return {
    startTimeMs,
    endTimeMs,
    englishText: form.englishText.trim(),
    vietnameseText: form.vietnameseText.trim(),
    orderIndex,
  }
}

export default function AdminShadowingPage() {
  const [page, setPage] = useState(0)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [subtitleForm, setSubtitleForm] = useState(emptySubtitleForm)
  const [editingSubtitle, setEditingSubtitle] = useState(null)
  const [importText, setImportText] = useState(importExample)

  const selectedLessonId = getId(selectedLesson)
  const lessonsQuery = useAdminShadowingLessons({ page, size: pageSize })
  const uploadMutation = useAdminUploadShadowingLesson()
  const statusQuery = useAdminShadowingProcessingStatus(selectedLessonId, { enabled: Boolean(selectedLessonId) })
  const subtitlesQuery = useAdminShadowingSubtitles(selectedLessonId, { enabled: Boolean(selectedLessonId) })
  const createSubtitleMutation = useCreateAdminShadowingSubtitle()
  const updateSubtitleMutation = useUpdateAdminShadowingSubtitle()
  const deleteSubtitleMutation = useDeleteAdminShadowingSubtitle()
  const importSubtitlesMutation = useImportAdminShadowingSubtitles()
  const generateAiMutation = useGenerateAiAdminShadowingSubtitles()

  const lessons = extractList(lessonsQuery.data, ['lessons', 'videos'])
  const totalPages = extractTotalPages(lessonsQuery.data, pageSize)
  const subtitles = useMemo(() => normalizeSubtitleList(subtitlesQuery.data), [subtitlesQuery.data])
  const selectedVideoUrl = getLessonVideoUrl(selectedLesson)
  const selectedThumbnailUrl = getLessonThumbnailUrl(selectedLesson)

  const columns = useMemo(() => [
    { key: 'title', header: 'Lesson', render: (lesson) => <span className="font-semibold text-white">{getLessonTitle(lesson)}</span> },
    { key: 'sourceType', header: 'Source', render: (lesson) => lesson.sourceType || lesson.source || 'UPLOAD' },
    { key: 'status', header: 'Status', render: (lesson) => <StatusBadge status={lesson.status || 'PENDING'} /> },
    { key: 'subtitleCount', header: 'Subtitles', render: (lesson) => Number(lesson.subtitleCount ?? 0) },
    { key: 'duration', header: 'Duration', render: (lesson) => lesson.duration || '-' },
    { key: 'createdAt', header: 'Created At', render: (lesson) => formatDate(lesson.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (lesson) => <Button size="sm" variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setSelectedLesson(lesson)}>Manage subtitles</Button>,
    },
  ], [])

  const handleUpload = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
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
      setSelectedLesson(lesson)
      setUploadFile(null)
      setUploadTitle('')
      setUploadDescription('')
      form.reset()
      toast.success('MP4 uploaded successfully')
    } catch (error) {
      toast.error(error.message || 'Unable to upload MP4')
    }
  }

  const resetSubtitleForm = () => {
    setSubtitleForm(emptySubtitleForm)
    setEditingSubtitle(null)
  }

  const handleSubtitleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedLessonId) {
      toast.error('Select a lesson first')
      return
    }

    try {
      const payload = buildSubtitlePayload(subtitleForm, subtitles.length)
      if (editingSubtitle) {
        await updateSubtitleMutation.mutateAsync({ lessonId: selectedLessonId, subtitleId: getSubtitleId(editingSubtitle), payload })
        toast.success('Subtitle updated')
      } else {
        await createSubtitleMutation.mutateAsync({ lessonId: selectedLessonId, payload })
        toast.success('Subtitle created')
      }
      resetSubtitleForm()
    } catch (error) {
      toast.error(error.message || 'Unable to save subtitle')
    }
  }

  const handleEditSubtitle = (subtitle) => {
    setEditingSubtitle(subtitle)
    setSubtitleForm({
      startTimeMs: String(subtitle.startTimeMs ?? ''),
      endTimeMs: String(subtitle.endTimeMs ?? ''),
      englishText: subtitle.englishText || '',
      vietnameseText: subtitle.vietnameseText || '',
      orderIndex: subtitle.orderIndex === undefined || subtitle.orderIndex === null ? '' : String(subtitle.orderIndex),
    })
  }

  const handleDeleteSubtitle = async (subtitle) => {
    if (!selectedLessonId) return
    try {
      await deleteSubtitleMutation.mutateAsync({ lessonId: selectedLessonId, subtitleId: getSubtitleId(subtitle) })
      toast.success('Subtitle deleted')
    } catch (error) {
      toast.error(error.message || 'Unable to delete subtitle')
    }
  }

  const handleImportSubtitles = async () => {
    if (!selectedLessonId) {
      toast.error('Select a lesson first')
      return
    }

    try {
      const rawPayload = JSON.parse(importText)
      const items = Array.isArray(rawPayload) ? rawPayload : rawPayload.items
      if (!Array.isArray(items)) throw new Error('Import JSON must be an array or include an items array')
      const normalizedItems = items.map((item, index) => normalizeSubtitlePayload(item, index))
      await importSubtitlesMutation.mutateAsync({
        lessonId: selectedLessonId,
        payload: {
          replaceExisting: Array.isArray(rawPayload) ? true : Boolean(rawPayload.replaceExisting),
          items: normalizedItems,
        },
      })
      toast.success('Subtitles imported')
    } catch (error) {
      toast.error(error.message || 'Unable to import subtitles')
    }
  }

  const handleGenerateAi = async () => {
    if (!selectedLessonId) {
      toast.error('Select a lesson first')
      return
    }

    try {
      await generateAiMutation.mutateAsync({ lessonId: selectedLessonId })
      toast.success('AI subtitles generated')
    } catch (error) {
      toast.error(error.message || 'Unable to generate AI subtitles')
    }
  }

  return (
    <AdminPageShell
      eyebrow="Media operations"
      title="Shadowing Management"
      description="Upload MP4 lessons to Cloudinary, preview returned videoUrl, and manage bilingual subtitles."
      error={lessonsQuery.error}
      onRetry={() => lessonsQuery.refetch()}
      actions={<Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => lessonsQuery.refetch()}><FiRefreshCw aria-hidden="true" /> Refresh</Button>}
    >
      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="rounded-2xl border border-white/10 bg-white/[0.035] p-5" onSubmit={handleUpload}>
          <div className="flex items-center gap-3"><FiUpload className="text-cyan-300" aria-hidden="true" /><h2 className="text-lg font-semibold text-white">Upload MP4</h2></div>
          <p className="mt-3 text-sm text-slate-400">Only MP4 upload is supported. Cloudinary and AI keys are configured by backend, not FE.</p>
          <input className="mt-5 h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none" value={uploadTitle} onChange={(event) => setUploadTitle(event.target.value)} placeholder="Lesson title" />
          <textarea className="mt-3 min-h-24 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none" value={uploadDescription} onChange={(event) => setUploadDescription(event.target.value)} placeholder="Description" />
          <input className="mt-3 block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:font-bold file:text-slate-950" type="file" accept="video/mp4" onChange={(event) => setUploadFile(event.target.files?.[0] || null)} />
          <Button className="mt-4 w-full" type="submit" disabled={uploadMutation.isPending}>{uploadMutation.isPending ? 'Uploading...' : 'Upload MP4 lesson'}</Button>
        </form>

        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-center gap-3"><FiVideo className="text-cyan-300" aria-hidden="true" /><h2 className="text-lg font-semibold text-white">Lesson preview</h2></div>
          {selectedVideoUrl ? (
            <video className="mt-5 aspect-video w-full rounded-2xl bg-black" src={selectedVideoUrl} poster={selectedThumbnailUrl} controls />
          ) : (
            <div className="mt-5 flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 text-sm text-slate-500">Upload or select a lesson to preview videoUrl</div>
          )}
          {selectedLesson ? (
            <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <p><span className="text-slate-500">Lesson:</span> {getLessonTitle(selectedLesson)}</p>
              <p><span className="text-slate-500">Status:</span> {selectedLesson.status || statusQuery.data?.status || 'UNKNOWN'}</p>
              <p><span className="text-slate-500">Progress:</span> {Number(statusQuery.data?.progress ?? selectedLesson.progress ?? 0)}%</p>
              <p><span className="text-slate-500">Subtitles:</span> {selectedLesson.subtitleCount ?? subtitles.length}</p>
            </div>
          ) : null}
          {statusQuery.error ? <p className="mt-4 text-sm text-rose-200">{statusQuery.error.message}</p> : null}
        </section>
      </section>

      {selectedLessonId ? (
        <section className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Subtitle tools</p>
                <h2 className="mt-2 text-lg font-semibold text-white">{getLessonTitle(selectedLesson)}</h2>
              </div>
              <Button type="button" onClick={handleGenerateAi} disabled={generateAiMutation.isPending}><FiCpu aria-hidden="true" /> {generateAiMutation.isPending ? 'Generating...' : 'Generate AI Subtitle'}</Button>
            </div>

            <form className="mt-5 grid gap-3" onSubmit={handleSubtitleSubmit}>
              <div className="grid gap-3 sm:grid-cols-3">
                <input className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none" value={subtitleForm.startTimeMs} onChange={(event) => setSubtitleForm((current) => ({ ...current, startTimeMs: event.target.value }))} placeholder="startTimeMs" />
                <input className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none" value={subtitleForm.endTimeMs} onChange={(event) => setSubtitleForm((current) => ({ ...current, endTimeMs: event.target.value }))} placeholder="endTimeMs" />
                <input className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none" value={subtitleForm.orderIndex} onChange={(event) => setSubtitleForm((current) => ({ ...current, orderIndex: event.target.value }))} placeholder="orderIndex" />
              </div>
              <textarea className="min-h-20 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none" value={subtitleForm.englishText} onChange={(event) => setSubtitleForm((current) => ({ ...current, englishText: event.target.value }))} placeholder="englishText (required)" />
              <textarea className="min-h-20 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none" value={subtitleForm.vietnameseText} onChange={(event) => setSubtitleForm((current) => ({ ...current, vietnameseText: event.target.value }))} placeholder="vietnameseText (optional)" />
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={createSubtitleMutation.isPending || updateSubtitleMutation.isPending}><FiSave aria-hidden="true" /> {editingSubtitle ? 'Update subtitle' : 'Create subtitle'}</Button>
                {editingSubtitle ? <Button type="button" variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={resetSubtitleForm}>Cancel edit</Button> : null}
              </div>
            </form>

            <div className="mt-6">
              <p className="text-sm font-semibold text-white">Import JSON</p>
              <p className="mt-1 text-xs text-slate-500">Paste JSON with replaceExisting and items. Set replaceExisting=false to append.</p>
              <textarea className="mt-3 min-h-56 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 font-mono text-xs text-slate-200 outline-none" value={importText} onChange={(event) => setImportText(event.target.value)} />
              <Button className="mt-3" type="button" variant="secondary" onClick={handleImportSubtitles} disabled={importSubtitlesMutation.isPending}>{importSubtitlesMutation.isPending ? 'Importing...' : 'Import subtitles'}</Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">Subtitles ({subtitles.length})</h2>
              <Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => subtitlesQuery.refetch()} disabled={subtitlesQuery.isFetching}><FiRefreshCw aria-hidden="true" /> Refresh subtitles</Button>
            </div>
            {subtitlesQuery.isLoading ? <p className="mt-5 text-sm text-slate-400">Loading subtitles...</p> : null}
            {subtitlesQuery.error ? <p className="mt-5 text-sm text-rose-200">{subtitlesQuery.error.message}</p> : null}
            <div className="mt-5 max-h-[720px] space-y-3 overflow-y-auto pr-1">
              {subtitles.map((subtitle, index) => (
                <article key={getSubtitleId(subtitle) || index} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">#{subtitle.orderIndex ?? index} {formatMs(subtitle.startTimeMs)} - {formatMs(subtitle.endTimeMs)}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => handleEditSubtitle(subtitle)}><FiEdit3 aria-hidden="true" /> Edit</Button>
                      <Button size="sm" variant="ghost" className="border border-rose-400/20 text-rose-200 hover:bg-rose-400/10" onClick={() => handleDeleteSubtitle(subtitle)} disabled={deleteSubtitleMutation.isPending}><FiTrash2 aria-hidden="true" /> Delete</Button>
                    </div>
                  </div>
                  <p className="mt-3 font-semibold text-white">{subtitle.englishText}</p>
                  {subtitle.vietnameseText ? <p className="mt-1 text-sm text-slate-400">{subtitle.vietnameseText}</p> : null}
                </article>
              ))}
              {!subtitlesQuery.isLoading && !subtitles.length ? <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">No subtitles yet. Create, import, or generate AI subtitles.</p> : null}
            </div>
          </div>
        </section>
      ) : null}

      <AdminDataTable
        className="mt-5"
        columns={columns}
        rows={lessons}
        isLoading={lessonsQuery.isLoading}
        emptyTitle="No shadowing lessons"
        emptyDescription="Upload an MP4 lesson to make it available for user shadowing practice."
        getRowKey={getId}
        pagination={{ page, totalPages, isLastPage: page + 1 >= totalPages || lessons.length < pageSize, onPageChange: setPage }}
      />
    </AdminPageShell>
  )
}
