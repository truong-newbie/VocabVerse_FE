export const SHADOWING_PAGE_SIZE = 10

export function normalizeShadowingLessonList(payload, fallbackSize = SHADOWING_PAGE_SIZE) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      totalItems: payload.length,
      totalPages: 1,
      page: 0,
      size: payload.length || fallbackSize,
    }
  }

  const items = payload?.content || payload?.items || payload?.data || payload?.lessons || payload?.videos || []
  const totalItems = Number(payload?.totalElements ?? payload?.totalItems ?? payload?.total ?? items.length)
  const size = Number(payload?.size ?? fallbackSize)
  return {
    items,
    totalItems,
    totalPages: Number(payload?.totalPages ?? Math.max(1, Math.ceil(totalItems / size))),
    page: Number(payload?.number ?? payload?.page ?? 0),
    size,
  }
}

export function getShadowingLessonId(lesson) {
  return lesson?.lessonId || lesson?.videoId || lesson?.id
}

export function getShadowingLessonTitle(lesson) {
  return lesson?.title || lesson?.name || 'Untitled shadowing lesson'
}

export function getShadowingLessonDescription(lesson) {
  return lesson?.description || 'Practice listening, VocabVerse, and pronunciation with bilingual subtitles.'
}

export function getShadowingVideoUrl(lesson) {
  return lesson?.videoUrl ||
    lesson?.videoURL ||
    lesson?.video_url ||
    lesson?.mediaUrl ||
    lesson?.mediaURL ||
    lesson?.media_url ||
    lesson?.fileUrl ||
    lesson?.fileURL ||
    lesson?.file_url ||
    lesson?.cloudinaryUrl ||
    lesson?.cloudinaryURL ||
    lesson?.cloudinary_url ||
    lesson?.secureUrl ||
    lesson?.secureURL ||
    lesson?.secure_url ||
    lesson?.sourceUrl ||
    lesson?.sourceURL ||
    lesson?.source_url ||
    lesson?.assetUrl ||
    lesson?.assetURL ||
    lesson?.asset_url ||
    lesson?.url ||
    ''
}

export function getShadowingAudioUrl(lesson) {
  return lesson?.audioUrl ||
    lesson?.audioURL ||
    lesson?.audio_url ||
    lesson?.mediaUrl ||
    lesson?.mediaURL ||
    lesson?.media_url ||
    lesson?.fileUrl ||
    lesson?.fileURL ||
    lesson?.file_url ||
    lesson?.cloudinaryUrl ||
    lesson?.cloudinaryURL ||
    lesson?.cloudinary_url ||
    lesson?.secureUrl ||
    lesson?.secureURL ||
    lesson?.secure_url ||
    lesson?.sourceUrl ||
    lesson?.sourceURL ||
    lesson?.source_url ||
    lesson?.assetUrl ||
    lesson?.assetURL ||
    lesson?.asset_url ||
    lesson?.url ||
    ''
}

export function getShadowingThumbnailUrl(lesson) {
  return lesson?.thumbnailUrl || lesson?.thumbnailURL || lesson?.thumbnail_url || lesson?.posterUrl || lesson?.posterURL || ''
}

export function getShadowingStatus(lesson) {
  return String(lesson?.status || 'READY').toUpperCase()
}

export function getStatusBadgeVariant(status) {
  if (status === 'FAILED') return 'destructive'
  if (status === 'PROCESSING') return 'warning'
  if (status === 'READY' || status === 'COMPLETED' || status === 'PUBLISHED') return 'success'
  return 'secondary'
}

export function getDifficultyBadgeVariant(difficulty) {
  if (difficulty === 'HARD') return 'destructive'
  if (difficulty === 'MEDIUM') return 'warning'
  if (difficulty === 'EASY') return 'success'
  return 'secondary'
}

export function formatShadowingDate(value) {
  if (!value) return 'No date yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'No date yet'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export function formatDuration(value) {
  if (value === undefined || value === null || value === '') return 'Unknown duration'
  if (typeof value === 'string' && value.includes(':')) return value
  const totalSeconds = Number(value)
  if (Number.isNaN(totalSeconds)) return String(value)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function normalizeSubtitleLines(lesson) {
  const raw = lesson?.subtitles || lesson?.subtitleLines || lesson?.transcript || []
  if (typeof raw === 'string') {
    return raw.split('\n').map((line, index) => ({
      id: index,
      startTimeMs: index * 4000,
      endTimeMs: index * 4000 + 4000,
      englishText: line.trim(),
      vietnameseText: '',
    })).filter((line) => line.englishText)
  }

  if (!Array.isArray(raw)) return []

  return raw.map((line, index) => ({
    ...line,
    id: line?.id ?? index,
    startTimeMs: Number(line?.startTimeMs ?? line?.startTime ?? line?.start ?? index * 4000),
    endTimeMs: Number(line?.endTimeMs ?? line?.endTime ?? line?.end ?? (Number(line?.startTimeMs ?? line?.startTime ?? line?.start ?? index * 4000) + 4000)),
    englishText: line?.englishText || line?.english || line?.text || '',
    vietnameseText: line?.vietnameseText || line?.vietnamese || line?.translation || '',
  })).sort((a, b) => {
    const left = Number(a.orderIndex ?? a.startTimeMs ?? 0)
    const right = Number(b.orderIndex ?? b.startTimeMs ?? 0)
    return left - right
  })
}

export function getCurrentSubtitleLine(lines, currentTimeMs) {
  return lines.find((line) => currentTimeMs >= line.startTimeMs && currentTimeMs <= line.endTimeMs) || lines[0] || null
}

export function isAdminUser(user) {
  const roles = [user?.role, ...(Array.isArray(user?.roles) ? user.roles : [])]
    .filter(Boolean)
    .map((role) => String(role).toUpperCase())
  return roles.some((role) => role === 'ADMIN' || role === 'ROLE_ADMIN' || role === 'SUPER_ADMIN')
}
