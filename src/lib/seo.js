export const APP_NAME = 'VocabVerse'

const defaultDescription =
  'VocabVerse is a focused vocabulary learning workspace for collections, reviews, flashcards, quizzes, typing practice, AI tools, shadowing, and roleplay.'

const routeMeta = [
  { pattern: /^\/login\/?$/, title: 'Login', description: 'Sign in to continue learning vocabulary.' },
  { pattern: /^\/register\/?$/, title: 'Create Account', description: 'Create your VocabVerse learning account.' },
  { pattern: /^\/dashboard\/?$/, title: 'Dashboard', description: 'Track vocabulary progress, reviews, and learning activity.' },
  { pattern: /^\/collections\/?$/, title: 'Collections', description: 'Organize vocabulary collections and learning sets.' },
  { pattern: /^\/collections\/[^/]+\/?$/, title: 'Collection Detail', description: 'Review and manage vocabularies in this collection.' },
  { pattern: /^\/vocabularies\/?$/, title: 'Vocabularies', description: 'Manage words, meanings, examples, and study status.' },
  { pattern: /^\/dictionary\/?$/, title: 'Dictionary', description: 'Search word meanings and add vocabulary to collections.' },
  { pattern: /^\/review\/?$/, title: 'Review', description: 'Practice due vocabulary with spaced repetition.' },
  { pattern: /^\/flashcards\/?$/, title: 'Flashcards', description: 'Study vocabulary with interactive flashcards.' },
  { pattern: /^\/quiz\/?$/, title: 'Quiz', description: 'Test vocabulary knowledge with quizzes.' },
  { pattern: /^\/typing\/?$/, title: 'Typing Practice', description: 'Improve recall through typing practice.' },
  { pattern: /^\/public\/collections\/?$/, title: 'Public Collections', description: 'Explore shared vocabulary collections.' },
  { pattern: /^\/public\/collections\/[^/]+\/?$/, title: 'Public Collection Detail', description: 'Preview a shared vocabulary collection before cloning it.' },
  { pattern: /^\/ai\/?$/, title: 'AI Tools', description: 'Normalize and generate vocabulary learning content.' },
  { pattern: /^\/shadowing\/?$/, title: 'Shadowing', description: 'Practice listening and speaking with shadowing lessons.' },
  { pattern: /^\/shadowing\/[^/]+\/?$/, title: 'Shadowing Lesson', description: 'Practice a selected shadowing lesson.' },
  { pattern: /^\/roleplay\/?$/, title: 'Roleplay', description: 'Practice vocabulary through roleplay conversations.' },
  { pattern: /^\/roleplay\/[^/]+\/?$/, title: 'Roleplay Session', description: 'Continue a vocabulary roleplay conversation.' },
  { pattern: /^\/admin\/?$/, title: 'Admin Dashboard', description: 'Monitor VocabVerse system activity and learning content.' },
  { pattern: /^\/admin\/dashboard\/?$/, title: 'Admin Dashboard', description: 'Monitor VocabVerse system activity and learning content.' },
  { pattern: /^\/admin\/users\/?$/, title: 'Admin Users', description: 'Manage VocabVerse users, roles, and account status.' },
  { pattern: /^\/admin\/collections\/?$/, title: 'Admin Collections', description: 'Moderate and manage user vocabulary collections.' },
  { pattern: /^\/admin\/public-collections\/?$/, title: 'Admin Public Collections', description: 'Review public vocabulary collections and visibility.' },
  { pattern: /^\/admin\/shadowing\/?$/, title: 'Admin Shadowing', description: 'Manage shadowing lessons, processing, and subtitles.' },
  { pattern: /^\/admin\/notifications\/?$/, title: 'Admin Notifications', description: 'Review system notifications and learning updates.' },
  { pattern: /^\/admin\/system\/?$/, title: 'Admin System', description: 'Check VocabVerse system health and operational status.' },
]

export function getRouteMeta(pathname = '/') {
  const match = routeMeta.find((item) => item.pattern.test(pathname))
  const title = match?.title || 'Page Not Found'
  return {
    title,
    fullTitle: `${title} | ${APP_NAME}`,
    description: match?.description || 'This VocabVerse page could not be found.',
  }
}

export function getAppUrl(pathname = '/') {
  const envUrl = import.meta.env.VITE_APP_URL?.trim()
  const origin = envUrl || (typeof window !== 'undefined' ? window.location.origin : '')

  if (!origin) return pathname

  try {
    return new URL(pathname, origin.endsWith('/') ? origin : `${origin}/`).toString()
  } catch {
    return pathname
  }
}

export function getDefaultMeta() {
  return {
    title: APP_NAME,
    fullTitle: APP_NAME,
    description: defaultDescription,
  }
}
