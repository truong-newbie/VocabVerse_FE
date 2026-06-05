export function normalizeReviewIntervals(values) {
  return values
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0)
}

export function getReviewIntervalsError(values) {
  if (!values.length) return 'Add at least one review interval.'
  const invalid = values.some((value) => !Number.isInteger(Number(value)) || Number(value) <= 0)
  if (invalid) return 'Intervals must be positive integers.'
  return ''
}
