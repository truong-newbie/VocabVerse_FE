import { FiZap } from 'react-icons/fi'
import LearningPlaceholderPage from '../LearningPlaceholderPage'

export default function FlashcardsPage() {
  return <LearningPlaceholderPage title="Flashcards" description="Prepare a focused card flow with progress, flip state, and self-evaluation controls." primaryAction="Start Flashcards" icon={FiZap} highlights={['Progress bar', 'Large card view', 'Hard medium easy controls']} />
}
