import { FiPlus, FiTrash2 } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { getReviewIntervalsError } from '@/features/review/reviewSettingsUtils'

export default function ReviewIntervalsEditor({ intervals, onChange, disabled = false }) {
  const error = getReviewIntervalsError(intervals)

  const updateInterval = (index, value) => {
    onChange(intervals.map((item, itemIndex) => (itemIndex === index ? value : item)))
  }

  const removeInterval = (index) => {
    onChange(intervals.filter((item, itemIndex) => itemIndex !== index))
  }

  return (
    <div className="rounded-card border border-border bg-background/70 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">Review Intervals</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Days after each successful review. Example: 1, 3, 7, 15, 30.</p>
        </div>
        <Badge variant={error ? 'warning' : 'success'}>{intervals.length} intervals</Badge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {intervals.map((interval, index) => (
          <div key={index} className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2">
            <input
              type="number"
              min="1"
              step="1"
              value={interval}
              disabled={disabled}
              onChange={(event) => updateInterval(index, event.target.value)}
              className="h-10 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
              aria-label={`Review interval ${index + 1}`}
            />
            <Button variant="ghost" className="h-10 w-10 px-0" disabled={disabled || intervals.length <= 1} onClick={() => removeInterval(index)} aria-label={`Remove interval ${index + 1}`}>
              <FiTrash2 aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>

      {error ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}

      <Button className="mt-4" variant="secondary" disabled={disabled} onClick={() => onChange([...intervals, ''])}>
        <FiPlus aria-hidden="true" /> Add interval
      </Button>
    </div>
  )
}
