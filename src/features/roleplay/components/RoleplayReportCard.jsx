import { FiAward, FiBookOpen, FiCheckCircle, FiTarget, FiTrendingUp } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import DashboardSection from '@/components/dashboard/DashboardSection'
import StatCard from '@/components/common/StatCard'
import { getReportScore, normalizeStringList } from '../roleplayUtils'

function ReportList({ title, items, tone = 'secondary' }) {
  const normalized = normalizeStringList(items)
  if (!normalized.length) return null

  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <Badge variant={tone}>{title}</Badge>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
        {normalized.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

export default function RoleplayReportCard({ report, session, onNewSession }) {
  if (!report) return null
  const score = getReportScore(report, session)

  return (
    <DashboardSection title="AI Session Report" description="Review your conversation performance and next practice targets.">
      <div className="space-y-5">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Overall" value={score || 'N/A'} icon={FiAward} tone="primary" />
          <StatCard label="Fluency" value={report.fluencyScore ?? 'N/A'} icon={FiTrendingUp} tone="success" />
          <StatCard label="Grammar" value={report.grammarScore ?? 'N/A'} icon={FiCheckCircle} tone="warning" />
          <StatCard label="Vocabulary" value={report.vocabularyScore ?? 'N/A'} icon={FiBookOpen} tone="success" />
        </section>

        {report.summary ? (
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <Badge variant="primary">Summary</Badge>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{report.summary}</p>
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <ReportList title="Strengths" items={report.strengths} tone="success" />
          <ReportList title="Weaknesses" items={report.weaknesses || report.mistakes} tone="destructive" />
          <ReportList title="Suggested Vocabulary" items={report.suggestedVocabulary || report.vocabulary} tone="primary" />
          <ReportList title="Grammar Feedback" items={report.grammarFeedback || report.grammar} tone="warning" />
          <ReportList title="Recommendations" items={report.recommendations} tone="secondary" />
        </div>

        {onNewSession ? (
          <button type="button" className="inline-flex items-center gap-2 rounded-button bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground" onClick={onNewSession}>
            <FiTarget aria-hidden="true" /> Start New Session
          </button>
        ) : null}
      </div>
    </DashboardSection>
  )
}
