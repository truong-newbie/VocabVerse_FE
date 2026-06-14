import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMic,
  FiPlay,
  FiRefreshCw,
  FiSearch,
  FiVideo,
  FiVolume2,
} from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import DashboardSection from '@/components/dashboard/DashboardSection'
import EmptyState from '@/components/common/EmptyState'
import ErrorFallback from '@/components/common/ErrorFallback'
import PageHeader from '@/components/common/PageHeader'
import ResponsiveContentContainer from '@/components/common/ResponsiveContentContainer'
import StatCard from '@/components/common/StatCard'
import {
  formatDuration,
  formatShadowingDate,
  getCurrentSubtitleLine,
  getDifficultyBadgeVariant,
  getShadowingLessonDescription,
  getShadowingLessonId,
  getShadowingLessonTitle,
  getShadowingStatus,
  getShadowingThumbnailUrl,
  getShadowingVideoUrl,
  getStatusBadgeVariant,
  normalizeShadowingLessonList,
  normalizeSubtitleLines,
  SHADOWING_PAGE_SIZE,
} from '@/features/shadowing/shadowingUtils'
import { useShadowingLesson, useShadowingLessons } from '@/features/shadowing/useShadowing'

const difficultyFilters = ['ALL', 'EASY', 'MEDIUM', 'HARD']
const playbackSpeeds = [0.75, 1, 1.25]

function ShadowingSkeleton() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="h-4 w-36 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded-full bg-muted" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-card border border-border bg-card" />
        ))}
      </div>
    </ResponsiveContentContainer>
  )
}

function DetailSkeleton() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="h-11 w-40 animate-pulse rounded-button bg-muted" />
      <div className="h-[420px] animate-pulse rounded-[28px] border border-border bg-card" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-28 animate-pulse rounded-card border border-border bg-card" />
        <div className="h-28 animate-pulse rounded-card border border-border bg-card" />
        <div className="h-28 animate-pulse rounded-card border border-border bg-card" />
      </div>
    </ResponsiveContentContainer>
  )
}

function ShadowingLessonCard({ lesson, onOpen }) {
  const title = getShadowingLessonTitle(lesson)
  const status = getShadowingStatus(lesson)
  const lessonId = getShadowingLessonId(lesson)
  const thumbnailUrl = getShadowingThumbnailUrl(lesson)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-card text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 bg-muted">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 via-muted to-success/10">
            <FiVideo aria-hidden="true" className="h-12 w-12 text-primary" />
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
          <Badge variant={getDifficultyBadgeVariant(lesson.difficulty)}>{lesson.difficulty || 'Level not set'}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h2 className="line-clamp-2 text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{getShadowingLessonDescription(lesson)}</p>
        </div>

        <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><FiVideo aria-hidden="true" className="h-4 w-4" /><span>{lesson.sourceType || 'VIDEO'}</span></div>
          <div className="flex items-center gap-2"><FiClock aria-hidden="true" className="h-4 w-4" /><span>{formatDuration(lesson.duration)}</span></div>
          <div className="flex items-center gap-2"><FiBookOpen aria-hidden="true" className="h-4 w-4" /><span>Created {formatShadowingDate(lesson.createdAt || lesson.updatedAt)}</span></div>
        </div>

        <Button className="mt-5 w-full" onClick={() => onOpen(lessonId)} disabled={!lessonId}>
          <FiPlay aria-hidden="true" /> {lesson.progress ? 'Continue' : 'Start Practice'}
        </Button>
      </div>
    </article>
  )
}

function formatSubtitleTime(value) {
  const totalMs = Number(value ?? 0)
  if (!Number.isFinite(totalMs)) return '0:00'
  const minutes = Math.floor(totalMs / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function ShadowingListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('ALL')
  const lessonsQuery = useShadowingLessons({ page, size: SHADOWING_PAGE_SIZE })
  const normalized = normalizeShadowingLessonList(lessonsQuery.data, SHADOWING_PAGE_SIZE)

  const filteredLessons = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return normalized.items.filter((lesson) => {
      const isReady = getShadowingStatus(lesson) === 'COMPLETED'
      const haystack = [getShadowingLessonTitle(lesson), getShadowingLessonDescription(lesson), lesson.sourceType, lesson.status, lesson.difficulty].filter(Boolean).join(' ').toLowerCase()
      const matchesSearch = !keyword || haystack.includes(keyword)
      const matchesDifficulty = difficulty === 'ALL' || lesson.difficulty === difficulty
      return isReady && matchesSearch && matchesDifficulty
    })
  }, [difficulty, normalized.items, search])

  if (lessonsQuery.isLoading) return <ShadowingSkeleton />

  if (lessonsQuery.error) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader title="Shadowing" description="Practice listening and speaking with real English videos." />
        <ErrorFallback title="Unable to load shadowing lessons" description={lessonsQuery.error.message} onRetry={() => lessonsQuery.refetch()} />
      </ResponsiveContentContainer>
    )
  }

  const totalPages = Math.max(1, normalized.totalPages)

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Shadowing library"
        title="Shadowing"
        description="Practice listening, VocabVerse, and pronunciation with focused bilingual media lessons."
      />

      <section className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Badge variant="primary"><span className="inline-flex items-center gap-1.5"><FiMic aria-hidden="true" /> Listen and repeat</span></Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Choose a lesson, then shadow line by line</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">The interface prioritizes clear subtitles and replay controls instead of entertainment-style video browsing.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[480px]">
            <StatCard label="Lessons" value={normalized.totalItems} icon={FiVideo} tone="primary" />
            <StatCard label="Visible" value={filteredLessons.length} icon={FiBookOpen} tone="success" />
            <StatCard label="Page" value={`${page + 1}/${totalPages}`} icon={FiClock} tone="warning" />
          </div>
        </div>
      </section>

      <section className="rounded-card border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
            <FiSearch aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
            <input
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search shadowing lessons..."
              aria-label="Search shadowing lessons"
            />
          </div>
          <select className="h-11 rounded-button border border-input bg-background px-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" value={difficulty} onChange={(event) => setDifficulty(event.target.value)} aria-label="Filter by difficulty">
            {difficultyFilters.map((item) => <option key={item} value={item}>{item === 'ALL' ? 'All difficulties' : item}</option>)}
          </select>
        </div>
      </section>

      {filteredLessons.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Shadowing lesson grid">
          {filteredLessons.map((lesson) => (
            <ShadowingLessonCard key={getShadowingLessonId(lesson)} lesson={lesson} onOpen={(lessonId) => navigate(`/shadowing/${lessonId}`)} />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={FiMic}
          title={search || difficulty !== 'ALL' ? 'No completed shadowing lessons match your filters' : 'No completed shadowing videos available'}
          description={search || difficulty !== 'ALL' ? 'Try a different search or difficulty filter.' : 'Please check again later.'}
          action={search || difficulty !== 'ALL' ? <Button onClick={() => { setSearch(''); setDifficulty('ALL') }}>Clear filters</Button> : null}
        />
      )}

      <section className="flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Showing {filteredLessons.length} lessons from this page.</p>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page <= 0} onClick={() => setPage((value) => Math.max(0, value - 1))}>
            <FiChevronLeft aria-hidden="true" /> Previous
          </Button>
          <Button variant="secondary" disabled={page + 1 >= totalPages} onClick={() => setPage((value) => value + 1)}>
            Next <FiChevronRight aria-hidden="true" />
          </Button>
        </div>
      </section>
    </ResponsiveContentContainer>
  )
}

function ShadowingDetailPage({ lessonId }) {
  const navigate = useNavigate()
  const mediaRef = useRef(null)
  const [currentTimeMs, setCurrentTimeMs] = useState(0)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [practicedLines, setPracticedLines] = useState({})
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showVietnamese, setShowVietnamese] = useState(true)
  const lessonQuery = useShadowingLesson(lessonId, { enabled: Boolean(lessonId) })
  const lesson = lessonQuery.data
  const videoUrl = getShadowingVideoUrl(lesson)
  const thumbnailUrl = getShadowingThumbnailUrl(lesson)
  const subtitleLines = useMemo(() => normalizeSubtitleLines(lesson), [lesson])
  const timedCurrentLine = getCurrentSubtitleLine(subtitleLines, currentTimeMs)
  const currentLine = subtitleLines[currentLineIndex] || timedCurrentLine

  const seekToLine = (line, index) => {
    if (!line) return
    setCurrentLineIndex(index)
    if (mediaRef.current) {
      mediaRef.current.currentTime = Number(line.startTimeMs || 0) / 1000
      mediaRef.current.play?.()
    }
  }

  const replayCurrentLine = () => {
    if (!currentLine || !mediaRef.current) return
    mediaRef.current.currentTime = Number(currentLine.startTimeMs || 0) / 1000
    mediaRef.current.play?.()
  }

  const updatePlaybackRate = (value) => {
    setPlaybackRate(value)
    if (mediaRef.current) mediaRef.current.playbackRate = value
  }

  const markCurrentLinePracticed = () => {
    if (!currentLine) return
    setPracticedLines((current) => ({ ...current, [String(currentLine.id)]: true }))
  }

  const nextLine = () => {
    if (!subtitleLines.length) return
    const nextIndex = Math.min(currentLineIndex + 1, subtitleLines.length - 1)
    seekToLine(subtitleLines[nextIndex], nextIndex)
  }

  const handleTimeUpdate = () => {
    const nextTimeMs = (mediaRef.current?.currentTime || 0) * 1000
    setCurrentTimeMs(nextTimeMs)
    const nextIndex = subtitleLines.findIndex((line) => nextTimeMs >= line.startTimeMs && nextTimeMs <= line.endTimeMs)
    if (nextIndex >= 0) setCurrentLineIndex(nextIndex)
  }

  if (lessonQuery.isLoading) return <DetailSkeleton />

  if (lessonQuery.error) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader title="Shadowing Lesson" description="Practice with bilingual subtitles." actions={<Button variant="secondary" onClick={() => navigate('/shadowing')}><FiArrowLeft aria-hidden="true" /> Back</Button>} />
        <ErrorFallback title="Unable to load shadowing lesson" description={lessonQuery.error.message} onRetry={() => lessonQuery.refetch()} />
      </ResponsiveContentContainer>
    )
  }

  const status = getShadowingStatus(lesson)
  const practicedCount = Object.keys(practicedLines).length

  return (
    <ResponsiveContentContainer className="space-y-8">
      <div>
        <Button variant="secondary" onClick={() => navigate('/shadowing')}><FiArrowLeft aria-hidden="true" /> Back to library</Button>
      </div>

      <PageHeader
        eyebrow="Shadowing lesson"
        title={getShadowingLessonTitle(lesson)}
        description={getShadowingLessonDescription(lesson)}
        actions={<Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>}
      />

      {status === 'PROCESSING' ? (
        <ErrorFallback title="Video is being processed" description="This lesson is not ready yet. Check again after processing completes." onRetry={() => lessonQuery.refetch()} />
      ) : null}

      {status === 'FAILED' ? (
        <ErrorFallback title="This video is temporarily unavailable" description="The backend marked this shadowing lesson as failed." onRetry={() => lessonQuery.refetch()} />
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-border bg-card p-4 shadow-sm">
          {videoUrl ? (
            <video ref={mediaRef} className="aspect-video w-full rounded-[22px] bg-slate-950" src={videoUrl} poster={thumbnailUrl} controls onTimeUpdate={handleTimeUpdate} onLoadedMetadata={() => updatePlaybackRate(playbackRate)} />
          ) : lesson.audioUrl ? (
            <div className="rounded-[22px] bg-muted p-8">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-primary/10 text-primary">
                <FiVolume2 aria-hidden="true" className="h-12 w-12" />
              </div>
            <audio ref={mediaRef} className="mt-8 w-full" src={lesson.audioUrl} controls onTimeUpdate={handleTimeUpdate} onLoadedMetadata={() => updatePlaybackRate(playbackRate)} />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-[22px] bg-muted text-center">
              <div>
                <FiVideo aria-hidden="true" className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-semibold">No media URL provided</p>
                <p className="mt-1 text-sm text-muted-foreground">The backend did not return videoUrl, video_url, mediaUrl, url, or audioUrl.</p>
              </div>
            </div>
          )}

          <div className="mt-4 rounded-[22px] border border-border bg-background/70 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Current subtitle</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">{currentLine?.englishText || lesson.englishSubtitle || 'No English subtitle available.'}</h2>
            {showVietnamese ? <p className="mt-3 text-lg font-semibold text-muted-foreground">{currentLine?.vietnameseText || lesson.vietnameseSubtitle || 'No Vietnamese subtitle available.'}</p> : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={replayCurrentLine} disabled={!currentLine}><FiRefreshCw aria-hidden="true" /> Replay Sentence</Button>
            {playbackSpeeds.map((speed) => (
              <Button key={speed} variant={playbackRate === speed ? 'primary' : 'secondary'} onClick={() => updatePlaybackRate(speed)}>{speed}x</Button>
            ))}
            <Button variant="secondary" onClick={() => setShowVietnamese((value) => !value)}>{showVietnamese ? 'Hide VI' : 'Show VI'}</Button>
            <Button variant="secondary" onClick={markCurrentLinePracticed} disabled={!currentLine}><FiCheckCircle aria-hidden="true" /> Mark As Practiced</Button>
            <Button variant="secondary" onClick={nextLine} disabled={!subtitleLines.length}>Next Sentence <FiChevronRight aria-hidden="true" /></Button>
          </div>
        </div>

        <DashboardSection title="Transcript" description="Click any line to seek and repeat that sentence.">
          {subtitleLines.length ? (
            <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1">
              {subtitleLines.map((line, index) => {
                const isActive = index === currentLineIndex
                const isPracticed = practicedLines[String(line.id)]
                return (
                  <button
                    key={line.id}
                    type="button"
                    className={`w-full rounded-2xl border p-4 text-left transition ${isActive ? 'border-primary bg-primary/5' : 'border-border bg-background/70 hover:border-primary/50'}`}
                    onClick={() => seekToLine(line, index)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant={isActive ? 'primary' : 'secondary'}>{formatSubtitleTime(line.startTimeMs)}</Badge>
                      {isPracticed ? <Badge variant="success">Practiced</Badge> : null}
                    </div>
                    <p className="mt-3 font-semibold leading-6">{line.englishText}</p>
                    {showVietnamese && line.vietnameseText ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{line.vietnameseText}</p> : null}
                  </button>
                )
              })}
            </div>
          ) : (
            <EmptyState icon={FiBookOpen} title="No transcript available" description="The backend did not return subtitles or transcript lines for this lesson." />
          )}
        </DashboardSection>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Source" value={lesson.sourceType || 'VIDEO'} icon={FiVideo} tone="primary" />
        <StatCard label="Duration" value={formatDuration(lesson.duration)} icon={FiClock} tone="success" />
        <StatCard label="Lines" value={subtitleLines.length} icon={FiBookOpen} tone="warning" />
        <StatCard label="Practiced" value={`${practicedCount}/${subtitleLines.length}`} icon={FiCheckCircle} tone="success" />
      </section>
    </ResponsiveContentContainer>
  )
}

export default function ShadowingPage() {
  const { lessonId } = useParams()
  if (lessonId) return <ShadowingDetailPage lessonId={lessonId} />
  return <ShadowingListPage />
}
