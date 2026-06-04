import { FiPenTool } from 'react-icons/fi'
import LearningPlaceholderPage from '../LearningPlaceholderPage'

export default function TypingPage() {
  return <LearningPlaceholderPage title="Typing Practice" description="Reserve the typing route for recall drills, answer feedback, and accuracy tracking." primaryAction="Start Typing" icon={FiPenTool} highlights={['Recall input', 'Instant feedback', 'Accuracy tracking']} />
}
