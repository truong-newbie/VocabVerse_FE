import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FiAlertTriangle, FiBell, FiClock, FiCpu, FiRefreshCw, FiSave, FiShield, FiSliders, FiTrendingUp } from 'react-icons/fi'
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
import {
  formatReminderTimeInput,
  getFsrsDesiredRetentionError,
  getFsrsMaxIntervalDaysError,
  getReviewIntervalsError,
  normalizeReminderTime,
  normalizeReviewIntervals,
} from '@/features/review/reviewSettingsUtils'
import ReviewIntervalsEditor from './ReviewIntervalsEditor'

const defaultIntervals = [1, 3, 7, 14, 30]
const defaultSchedulerType = 'FIXED_INTERVAL'
const defaultFsrsDesiredRetention = 0.9
const defaultFsrsMaxIntervalDays = 3650
const schedulerOptions = [
  {
    value: 'FIXED_INTERVAL',
    label: 'Fixed interval',
    description: 'Use your custom day intervals.',
    disabled: false,
  },
  {
    value: 'SM2',
    label: 'SM-2',
    description: 'Automatically adjusts review dates based on your answers.',
    disabled: false,
  },
  {
    value: 'FSRS',
    label: 'FSRS',
    description: 'Adapts review timing using memory difficulty, stability, and retention.',
    disabled: false,
  },
]
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
  const schedulerType = getSchedulerType(settings?.schedulerType || defaultSchedulerType)

  return {
    reviewEnabled: settings?.reviewEnabled ?? settings?.enabled ?? true,
    emailReminderEnabled: settings?.emailReminderEnabled ?? settings?.emailReminder ?? settings?.emailEnabled ?? false,
    schedulerType,
    reminderTime: formatReminderTimeInput(settings?.reminderTime),
    timezone: settings?.timezone || 'Asia/Ho_Chi_Minh',
    reviewIntervals: intervals.map(String),
    fsrsDesiredRetention: Number(settings?.fsrsDesiredRetention ?? defaultFsrsDesiredRetention),
    fsrsMaxIntervalDays: String(settings?.fsrsMaxIntervalDays ?? defaultFsrsMaxIntervalDays),
  }
}

function getSchedulerType(value) {
  return schedulerOptions.some((option) => option.value === value) ? value : defaultSchedulerType
}

function SchedulerModeSelector({ value, onChange, disabled }) {
  return (
    <div className="rounded-card border border-border bg-background/70 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 font-semibold"><FiCpu aria-hidden="true" /> Review algorithm</div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Choose how this collection schedules the next review date.</p>
        </div>
        <Badge variant={value === 'FIXED_INTERVAL' ? 'secondary' : 'primary'}>{value === 'FIXED_INTERVAL' ? 'Manual' : 'Adaptive'}</Badge>
      </div>

      <div className="mt-4 grid gap-2 lg:grid-cols-3" role="radiogroup" aria-label="Review algorithm">
        {schedulerOptions.map((option) => {
          const isSelected = value === option.value
          const isDisabled = disabled || option.disabled

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isDisabled}
              onClick={() => onChange(option.value)}
              className={`min-h-24 rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isSelected
                  ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                  : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">{option.label}</span>
                <span className={`h-3 w-3 rounded-full border ${isSelected ? 'border-primary bg-primary' : 'border-border'}`} aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">{option.description}</p>
            </button>
          )
        })}
      </div>

      {value === 'SM2' ? (
        <p className="mt-3 rounded-2xl border border-primary/15 bg-primary/10 p-3 text-sm leading-6 text-primary">
          SM-2 will be applied from the next review. The backend calculates ease factor, repetition count, and next review date.
        </p>
      ) : null}
      {value === 'FSRS' ? (
        <p className="mt-3 rounded-2xl border border-primary/15 bg-primary/10 p-3 text-sm leading-6 text-primary">
          FSRS will be applied from the next review. The backend calculates memory difficulty, stability, retrievability, and next review date.
        </p>
      ) : null}
    </div>
  )
}

function FsrsSettingsPanel({ desiredRetention, maxIntervalDays, onChangeDesiredRetention, onChangeMaxIntervalDays, desiredRetentionError, maxIntervalDaysError, disabled }) {
  const retentionPercent = Math.round(Number(desiredRetention || defaultFsrsDesiredRetention) * 100)

  return (
    <div className="rounded-card border border-primary/20 bg-primary/10 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 font-semibold text-primary"><FiTrendingUp aria-hidden="true" /> FSRS advanced settings</div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Tune retention target and the longest allowed gap. The backend still calculates the actual next review date.</p>
        </div>
        <Badge variant="primary">Adaptive memory model</Badge>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <label className="font-semibold" htmlFor="fsrs-desired-retention">Desired retention</label>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Higher retention means more frequent reviews.</p>
            </div>
            <Badge variant={desiredRetentionError ? 'warning' : 'success'}>{retentionPercent}%</Badge>
          </div>
          <input
            id="fsrs-desired-retention"
            type="range"
            min="0.7"
            max="0.98"
            step="0.01"
            value={desiredRetention}
            disabled={disabled}
            onChange={(event) => onChangeDesiredRetention(Number(event.target.value))}
            className="mt-4 w-full accent-primary disabled:opacity-60"
          />
          <div className="mt-2 flex justify-between text-xs font-semibold text-muted-foreground">
            <span>70%</span>
            <span>98%</span>
          </div>
          {desiredRetentionError ? <p className="mt-3 text-sm font-semibold text-destructive">{desiredRetentionError}</p> : null}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <label className="font-semibold" htmlFor="fsrs-max-interval">Max interval</label>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">The longest gap allowed between reviews.</p>
          <div className="mt-4 flex items-center gap-2">
            <input
              id="fsrs-max-interval"
              type="number"
              min="1"
              max="3650"
              step="1"
              value={maxIntervalDays}
              disabled={disabled}
              onChange={(event) => onChangeMaxIntervalDays(event.target.value)}
              className="h-11 min-w-0 flex-1 rounded-button border border-input bg-background px-4 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
            />
            <span className="text-sm font-semibold text-muted-foreground">days</span>
          </div>
          {maxIntervalDaysError ? <p className="mt-3 text-sm font-semibold text-destructive">{maxIntervalDaysError}</p> : null}
        </div>
      </div>
    </div>
  )
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

  const intervalsError = useMemo(
    () => (form.schedulerType === 'FIXED_INTERVAL' ? getReviewIntervalsError(form.reviewIntervals) : ''),
    [form.reviewIntervals, form.schedulerType],
  )
  const fsrsDesiredRetentionError = useMemo(
    () => (form.schedulerType === 'FSRS' ? getFsrsDesiredRetentionError(form.fsrsDesiredRetention) : ''),
    [form.fsrsDesiredRetention, form.schedulerType],
  )
  const fsrsMaxIntervalDaysError = useMemo(
    () => (form.schedulerType === 'FSRS' ? getFsrsMaxIntervalDaysError(form.fsrsMaxIntervalDays) : ''),
    [form.fsrsMaxIntervalDays, form.schedulerType],
  )
  const firstValidationError = intervalsError || fsrsDesiredRetentionError || fsrsMaxIntervalDaysError

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSave = async () => {
    if (!['FIXED_INTERVAL', 'SM2', 'FSRS'].includes(form.schedulerType)) {
      toast.error('Select a supported review algorithm.')
      return
    }

    if (firstValidationError) {
      toast.error(firstValidationError)
      return
    }

    const payload = {
      enabled: form.reviewEnabled,
      emailEnabled: form.emailReminderEnabled,
      schedulerType: form.schedulerType,
      reminderTime: normalizeReminderTime(form.reminderTime),
      timezone: form.timezone || null,
    }

    if (form.schedulerType === 'FIXED_INTERVAL') {
      payload.intervals = normalizeReviewIntervals(form.reviewIntervals)
    }

    if (form.schedulerType === 'FSRS') {
      payload.fsrsDesiredRetention = Number(form.fsrsDesiredRetention)
      payload.fsrsMaxIntervalDays = Number(form.fsrsMaxIntervalDays)
    }

    try {
      await updateSettings.mutateAsync({
        collectionId,
        payload,
      })
      toast.success('Review settings saved')
    } catch (error) {
      if (error.code === 'SCHEDULER_NOT_SUPPORTED') {
        toast.error('Backend has not enabled this review scheduler yet.')
        return
      }
      if (error.code === 'INVALID_INPUT') {
        toast.error('Please check your FSRS settings.')
        return
      }
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
            <Badge variant={form.schedulerType === 'FIXED_INTERVAL' ? 'secondary' : 'primary'}>
              {form.schedulerType === 'SM2' ? 'SM-2' : form.schedulerType === 'FSRS' ? 'FSRS' : 'Fixed interval'}
            </Badge>
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">Spaced repetition schedule</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Choose a review algorithm, tune reminders, and reset scheduling for this collection.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleSave} disabled={isBusy || Boolean(firstValidationError)}>
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

      <div className="mt-6">
        <SchedulerModeSelector
          value={form.schedulerType}
          disabled={isBusy}
          onChange={(value) => setField('schedulerType', getSchedulerType(value))}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
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
        {form.schedulerType === 'FIXED_INTERVAL' ? (
          <ReviewIntervalsEditor intervals={form.reviewIntervals} onChange={(value) => setField('reviewIntervals', value)} disabled={isBusy} />
        ) : form.schedulerType === 'SM2' ? (
          <div className="rounded-card border border-primary/20 bg-primary/10 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-primary/15 p-3 text-primary">
                <FiCpu aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">SM-2 manages intervals automatically</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Manual day intervals are not used in SM-2 mode. The backend calculates the next review date from AGAIN, HARD, GOOD, and EASY.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <FsrsSettingsPanel
            desiredRetention={form.fsrsDesiredRetention}
            maxIntervalDays={form.fsrsMaxIntervalDays}
            desiredRetentionError={fsrsDesiredRetentionError}
            maxIntervalDaysError={fsrsMaxIntervalDaysError}
            disabled={isBusy}
            onChangeDesiredRetention={(value) => setField('fsrsDesiredRetention', value)}
            onChangeMaxIntervalDays={(value) => setField('fsrsMaxIntervalDays', value)}
          />
        )}
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
          <p className="mt-3 font-semibold">Fixed interval uses days</p>
          <p className="mt-1 text-sm text-muted-foreground">Intervals are editable only when Fixed interval is selected.</p>
        </div>
        <div className="rounded-2xl bg-muted p-4">
          <FiBell aria-hidden="true" className="text-success" />
          <p className="mt-3 font-semibold">Reminder is optional</p>
          <p className="mt-1 text-sm text-muted-foreground">Email reminders use your selected time and timezone.</p>
        </div>
        <div className="rounded-2xl bg-muted p-4">
          <FiShield aria-hidden="true" className="text-warning" />
          <p className="mt-3 font-semibold">Schedulers run on backend</p>
          <p className="mt-1 text-sm text-muted-foreground">Review Today still sends only AGAIN, HARD, GOOD, or EASY.</p>
        </div>
      </div>

      <ConfirmDialog
        open={resetOpen}
        title="Reset review schedule?"
        description="This will reset progress scheduling for all vocabulary in this collection."
        confirmLabel="Reset Schedule"
        destructive
        isSubmitting={resetSchedule.isPending}
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </section>
  )
}
