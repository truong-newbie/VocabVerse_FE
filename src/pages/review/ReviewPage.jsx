import { FiRepeat } from 'react-icons/fi'
import LearningPlaceholderPage from '../LearningPlaceholderPage'

export default function ReviewPage() {
  return <LearningPlaceholderPage title="Review Today" description="Show due collections, review summary, and spaced repetition history." primaryAction="Explore Collections" icon={FiRepeat} highlights={['Review summary', 'Due collections', 'Review history']} />
}
