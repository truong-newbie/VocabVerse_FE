import { FiMessageCircle } from 'react-icons/fi'
import LearningPlaceholderPage from '../LearningPlaceholderPage'

export default function RoleplayPage() {
  return <LearningPlaceholderPage title="Roleplay" description="Practice realistic English conversations with scenario setup, chat, and correction panels." primaryAction="Start Roleplay" icon={FiMessageCircle} highlights={['Scenario panel', 'Chat panel', 'Correction panel']} />
}
