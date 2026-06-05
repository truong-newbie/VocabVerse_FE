import Badge from '@/components/ui/Badge'
import { getDifficultyTone } from '../roleplayUtils'

export default function DifficultyBadge({ difficulty }) {
  return <Badge variant={getDifficultyTone(difficulty)}>{difficulty || 'EASY'}</Badge>
}
