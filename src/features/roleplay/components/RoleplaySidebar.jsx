import { FiMessageCircle, FiUser } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import DashboardSection from '@/components/dashboard/DashboardSection'
import DifficultyBadge from './DifficultyBadge'
import { getScenarioDescription } from '../roleplayUtils'

export default function RoleplaySidebar({ session }) {
  const scenario = session?.scenario || session?.scenarioDescription || getScenarioDescription(session)

  return (
    <DashboardSection title="Scenario" description="Stay in character and respond naturally.">
      <div className="space-y-4">
        <div className="rounded-2xl bg-muted p-4">
          <p className="text-sm text-muted-foreground">Topic</p>
          <p className="mt-1 text-xl font-bold">{session?.topic || 'Daily Conversation'}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-muted p-4">
            <p className="text-sm text-muted-foreground">Difficulty</p>
            <div className="mt-2"><DifficultyBadge difficulty={session?.difficulty || 'Beginner'} /></div>
          </div>
          <div className="rounded-2xl bg-muted p-4">
            <p className="text-sm text-muted-foreground">Persona</p>
            <Badge className="mt-2" variant="primary"><span className="inline-flex items-center gap-1.5"><FiUser aria-hidden="true" /> {session?.persona || 'Teacher'}</span></Badge>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <FiMessageCircle aria-hidden="true" /> Scenario Preview
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{scenario}</p>
        </div>
      </div>
    </DashboardSection>
  )
}
