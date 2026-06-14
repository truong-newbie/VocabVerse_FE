export function normalizeReviewIntervals(values) {
  return values
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= 3650)
}

export function getReviewIntervalsError(values) {
  if (!values.length) return 'Add at least one review interval.'
  const invalid = values.some((value) => !Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 3650)
  if (invalid) return 'Intervals must be whole days from 1 to 3650.'
  return ''
}

export function normalizeReminderTime(value) {
  if (!value) return null
  return value.length === 5 ? `${value}:00` : value
}

export function formatReminderTimeInput(value) {
  if (!value) return '08:00'
  return value.length >= 5 ? value.slice(0, 5) : value
}

export function getFsrsDesiredRetentionError(value) {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue) || numberValue < 0.7 || numberValue > 0.98) {
    return 'Desired retention must be between 70% and 98%.'
  }
  return ''
}

export function getFsrsMaxIntervalDaysError(value) {
  const numberValue = Number(value)
  if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 3650) {
    return 'Max interval must be a whole number from 1 to 3650 days.'
  }
  return ''
}
