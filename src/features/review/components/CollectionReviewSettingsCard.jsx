import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FiAlertTriangle, FiBell, FiClock, FiRefreshCw, FiSave, FiShield, FiSliders } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import ErrorFallback from '@/components/common/ErrorFallback'
import {
  useCollectionReviewSettings,
  useDisableCollectionReview,
  useResetCollectionReviewSchedule,
  useUpdateCollectionReviewSettings,
} from '@/features/review/useReviews'
import { getReviewIntervalsError, normalizeReviewIntervals } from '@/features/review/reviewSettingsUtils'
import ReviewIntervalsEditor from './ReviewIntervalsEditor'

const defaultIntervals = [1, 3, 7, 15, 30]
const timezoneOptions = [
  'Asia/Ho_Chi_Minh',
  'Asia/Bangkok',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
  'UTC',
]

function normalizeSettings(settings) {
  const intervals = settings?.reviewIntervals || settings?.intervals || defaultIntervals

  return {
    reviewEnabled: settings?.reviewEnabled ?? settings?.enabled ?? true,
    emailReminderEnabled: settings?.emailReminderEnabled ?? settings?.emailReminder ?? false,
    reminderTime: settings?.reminderTime || '08:00',
    timezone: settings?.timezone || 'Asia/Ho_Chi_Minh',
    reviewIntervals: intervals.map(String),
  }
}

function ToggleField({ id, label, description, checked, onChange, disabled }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-border bg-background/70 p-4">
      <span>
        <span className="block font-semibold">{label}</span>
        <span className="mt-1 block text-sm leading-6 text-muted-foreground">{description}</span>
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 accent-primary disabled:opacity-60"
      />
    </label>
  )
}

function ReviewSettingsSkeleton() {
  return (
    <section className="rounded-card border border-border bg-card p-6 shadow-sm">
      <div className="h-6 w-48 animate-pulse rounded-full bg-muted" />
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
      </div>
      <div className="mt-5 h-32 animate-pulse rounded-2xl bg-muted" />
    </section>
  )
}

export default function CollectionReviewSettingsCard({ collectionId }) {
  const [form, setForm] = useState(normalizeSettings())
  const [resetOpen, setResetOpen] = useState(false)
  const settingsQuery = useCollectionReviewSettings(collectionId)
  const updateSettings = useUpdateCollectionReviewSettings()
  const disableReview = useDisableCollectionReview()
  const resetSchedule = useResetCollectionReviewSchedule()
  const isBusy = updateSettings.isPending || disableReview.isPending || resetSchedule.isPending

  useEffect(() => {
    if (settingsQuery.data) {
      setForm(normalizeSettings(settingsQuery.data))
    }
  }, [settingsQuery.data])

  const intervalsError = useMemo(() => getReviewIntervalsError(form.reviewIntervals), [form.reviewIntervals])

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSave = async () => {
    if (intervalsError) {
      toast.error(intervalsError)
      return
    }

    try {
      await updateSettings.mutateAsync({
        collectionId,
        payload: {
          reviewEnabled: form.reviewEnabled,
          emailReminderEnabled: form.emailReminderEnabled,
          reminderTime: form.reminderTime,
          timezone: form.timezone,
          reviewIntervals: normalizeReviewIntervals(form.reviewIntervals),
        },
      })
      toast.success('Review settings saved')
    } catch (error) {
      toast.error(error.message || 'Unable to save review settings')
    }
  }

  const handleDisable = async () => {
    try {
      await disableReview.mutateAsync({ collectionId })
      setField('reviewEnabled', false)
      toast.success('Review disabled for this collection')
    } catch (error) {
      toast.error(error.message || 'Unable to disable review')
    }
  }

  const handleReset = async () => {
    try {
      await resetSchedule.mutateAsync({ collectionId })
      setResetOpen(false)
      toast.success('Review schedule reset')
    } catch (error) {
      toast.error(error.message || 'Unable to reset review schedule')
    }
  }

  if (settingsQuery.isLoading) return <ReviewSettingsSkeleton />

  if (settingsQuery.error) {
    return (
      <section className="rounded-card border border-border bg-card p-6 shadow-sm">
        <ErrorFallback
          title="Unable to load review settings"
          description={settingsQuery.error.message || 'Collection review settings could not be loaded.'}
          onRetry={() => settingsQuery.refetch()}
        />
      </section>
    )
  }

  return (
    <section className="rounded-card border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary"><span className="inline-flex items-center gap-1.5"><FiSliders aria-hidden="true" /> Review Settings</span></Badge>
            <Badge variant={form.reviewEnabled ? 'success' : 'warning'}>{form.reviewEnabled ? 'Enabled' : 'Disabled'}</Badge>
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">Spaced repetition schedule</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Tune review intervals, reminders, and reset behavior for this collection. Built for Anki-style control with a safer workflow.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleSave} disabled={isBusy || Boolean(intervalsError)}>
            <FiSave aria-hidden="true" /> {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button variant="secondary" onClick={handleDisable} disabled={isBusy || !form.reviewEnabled}>
            <FiShield aria-hidden="true" /> {disableReview.isPending ? 'Disabling...' : 'Disable'}
          </Button>
          <Button variant="destructive" onClick={() => setResetOpen(true)} disabled={isBusy}>
            <FiRefreshCw aria-hidden="true" /> Reset Schedule
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ToggleField
          id="review-enabled"
          label="Enable Review"
          description="Include this collection in spaced repetition scheduling."
          checked={form.reviewEnabled}
          disabled={isBusy}
          onChange={(value) => setField('reviewEnabled', value)}
        />
        <ToggleField
          id="email-reminder"
          label="Email Reminder"
          description="Send reminder email at the configured time."
          checked={form.emailReminderEnabled}
          disabled={isBusy}
          onChange={(value) => setField('emailReminderEnabled', value)}
        />
        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <div className="flex items-center gap-2 font-semibold"><FiBell aria-hidden="true" /> Reminder details</div>
          <label className="mt-4 block text-sm font-semibold text-foreground" htmlFor="reminder-time">Reminder Time</label>
          <input
            id="reminder-time"
            type="time"
            value={form.reminderTime}
            disabled={isBusy || !form.emailReminderEnabled}
            onChange={(event) => setField('reminderTime', event.target.value)}
            className="mt-2 h-11 w-full rounded-button border border-input bg-background px-4 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
          />
          <label className="mt-4 block text-sm font-semibold text-foreground" htmlFor="review-timezone">Timezone</label>
          <select
            id="review-timezone"
            value={form.timezone}
            disabled={isBusy}
            onChange={(event) => setField('timezone', event.target.value)}
            className="mt-2 h-11 w-full rounded-button border border-input bg-background px-4 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
          >
            {timezoneOptions.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <ReviewIntervalsEditor intervals={form.reviewIntervals} onChange={(value) => setField('reviewIntervals', value)} disabled={isBusy} />
      </div>

      <div className="mt-5 rounded-2xl border border-warning/30 bg-warning/10 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-warning/15 p-3 text-warning">
            <FiAlertTriangle aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold">Resetting spaced repetition will restart review progress for vocabularies in this collection.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Use reset only when the schedule is wrong or you want to relearn the collection from the beginning.</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-muted p-4">
          <FiClock aria-hidden="true" className="text-primary" />
          <p className="mt-3 font-semibold">Intervals are days</p>
          <p className="mt-1 text-sm text-muted-foreground">Every value must be a positive integer.</p>
        </div>
        <div className="rounded-2xl bg-muted p-4">
          <FiBell aria-hidden="true" className="text-success" />
          <p className="mt-3 font-semibold">Reminder is optional</p>
          <p className="mt-1 text-sm text-muted-foreground">Email reminders use your selected time and timezone.</p>
        </div>
        <div className="rounded-2xl bg-muted p-4">
          <FiShield aria-hidden="true" className="text-warning" />
          <p className="mt-3 font-semibold">Reset is guarded</p>
          <p className="mt-1 text-sm text-muted-foreground">A confirmation dialog prevents accidental schedule resets.</p>
        </div>
      </div>

      <ConfirmDialog
        open={resetOpen}
        title="Reset review schedule"
        description="Resetting spaced repetition will restart review progress for vocabularies in this collection."
        confirmLabel="Reset Schedule"
        destructive
        isSubmitting={resetSchedule.isPending}
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </section>
  )
}
