import { FiTarget } from 'react-icons/fi'
import LearningPlaceholderPage from '../LearningPlaceholderPage'

export default function QuizPage() {
  return <LearningPlaceholderPage title="Quiz" description="Prepare multiple-choice, fill-in-blank, meaning match, and mixed quiz flows." primaryAction="Start Quiz" icon={FiTarget} highlights={['Quiz type setup', 'Question options', 'Result review']} />
}
