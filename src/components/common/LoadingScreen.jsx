import PageSkeleton from './PageSkeleton'

export default function LoadingScreen({ title = 'Loading your learning space...', description = 'Preparing cards, reviews, and practice data.', variant = 'dashboard' }) {
  return <PageSkeleton variant={variant} title={title} description={description} />
}
