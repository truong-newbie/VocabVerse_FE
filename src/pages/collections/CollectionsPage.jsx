import { FiLayers } from 'react-icons/fi'
import LearningPlaceholderPage from '../LearningPlaceholderPage'

export default function CollectionsPage() {
  return <LearningPlaceholderPage title="My Collections" description="Manage vocabulary collections, visibility, importing, and learning actions." primaryAction="Create Collection" icon={FiLayers} highlights={['Search collections', 'Visibility filters', 'Collection grid']} />
}
