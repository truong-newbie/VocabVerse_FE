import { FiBookOpen } from 'react-icons/fi'
import LearningPlaceholderPage from '../LearningPlaceholderPage'

export default function VocabulariesPage() {
  return <LearningPlaceholderPage title="Vocabulary Search" description="Browse, search, and prepare vocabulary records for collections and practice sessions." primaryAction="Import Vocabulary" icon={FiBookOpen} highlights={['Search words', 'Vocabulary table', 'AI normalize flow']} />
}
