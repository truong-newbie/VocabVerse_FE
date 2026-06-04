import { FiCpu } from 'react-icons/fi'
import LearningPlaceholderPage from '../LearningPlaceholderPage'

export default function AiPage() {
  return <LearningPlaceholderPage title="AI Coach" description="Prepare AI-assisted vocabulary import, explanations, memory tips, and learning recommendations." primaryAction="Ask AI Coach" icon={FiCpu} highlights={['AI import', 'Memory tips', 'Personal recommendations']} />
}
