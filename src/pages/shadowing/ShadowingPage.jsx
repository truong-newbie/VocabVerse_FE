import { FiMic } from 'react-icons/fi'
import LearningPlaceholderPage from '../LearningPlaceholderPage'

export default function ShadowingPage() {
  return <LearningPlaceholderPage title="Shadowing" description="Practice listening and speaking with focused video, bilingual subtitles, and replay controls." primaryAction="Start Practice" icon={FiMic} highlights={['Video library', 'Subtitle focus', 'Replay sentence']} />
}
