export type ShadowingSourceType = 'UPLOAD' | 'VIDEO' | 'AUDIO' | string

export type ShadowingStatus = 'PROCESSING' | 'READY' | 'COMPLETED' | 'FAILED' | 'PUBLISHED' | string

export type ShadowingDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | string

export type ShadowingSubtitleLine = {
  id?: string | number
  subtitleId?: string | number
  startTimeMs?: number
  endTimeMs?: number
  startTime?: number
  endTime?: number
  start?: number
  end?: number
  time?: string
  englishText?: string
  english?: string
  text?: string
  vietnameseText?: string
  vietnamese?: string
  translation?: string
  orderIndex?: number
}

export type ShadowingLesson = {
  id?: string | number
  lessonId?: string | number
  videoId?: string | number
  title?: string
  name?: string
  description?: string
  sourceType?: ShadowingSourceType
  status?: ShadowingStatus
  difficulty?: ShadowingDifficulty
  duration?: number | string
  thumbnailUrl?: string
  videoUrl?: string
  videoURL?: string
  video_url?: string
  audioUrl?: string
  audioURL?: string
  audio_url?: string
  mediaUrl?: string
  mediaURL?: string
  media_url?: string
  fileUrl?: string
  fileURL?: string
  file_url?: string
  cloudinaryUrl?: string
  cloudinaryURL?: string
  cloudinary_url?: string
  secureUrl?: string
  secureURL?: string
  secure_url?: string
  sourceUrl?: string
  sourceURL?: string
  source_url?: string
  assetUrl?: string
  assetURL?: string
  asset_url?: string
  url?: string
  originalFilename?: string
  cloudinaryPublicId?: string
  storageProvider?: string
  contentType?: string
  fileSize?: number
  subtitleCount?: number
  errorMessage?: string | null
  transcript?: string | ShadowingSubtitleLine[]
  subtitles?: ShadowingSubtitleLine[]
  subtitleLines?: ShadowingSubtitleLine[]
  englishSubtitle?: string
  vietnameseSubtitle?: string
  progress?: number
  createdAt?: string
  updatedAt?: string
}

export type ShadowingLessonListResponse = ShadowingLesson[] | {
  content?: ShadowingLesson[]
  items?: ShadowingLesson[]
  data?: ShadowingLesson[]
  lessons?: ShadowingLesson[]
  videos?: ShadowingLesson[]
  totalElements?: number
  totalItems?: number
  total?: number
  totalPages?: number
  page?: number
  number?: number
  size?: number
}

export type ShadowingLessonQueryParams = {
  page?: number
  size?: number
}

export type UploadShadowingLessonRequest = {
  file: File
  title?: string
  description?: string
}

export type ShadowingProcessingStatus = {
  lessonId?: string | number
  id?: string | number
  status?: ShadowingStatus
  message?: string
  progress?: number
  error?: string
}
