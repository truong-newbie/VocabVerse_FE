import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import Button from '@/components/ui/Button'

const examples = ['abandon', 'benefit', 'maintain']

export default function DictionarySearchBar({ initialValue = '', isSearching = false, onSearch }) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const submit = (event) => {
    event.preventDefault()
    const word = value.trim()
    if (word) onSearch(word)
  }

  return (
    <section className="rounded-card border border-border bg-card p-5 shadow-sm">
      <form className="grid gap-3 lg:grid-cols-[1fr_auto]" onSubmit={submit}>
        <label className="flex min-h-16 items-center gap-4 rounded-2xl border border-input bg-background px-5 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
          <FiSearch aria-hidden="true" className="h-6 w-6 shrink-0 text-muted-foreground" />
          <input
            className="w-full bg-transparent text-xl font-semibold text-foreground outline-none placeholder:text-muted-foreground"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search an English word..."
            aria-label="Search an English word"
            disabled={isSearching}
          />
        </label>
        <Button type="submit" size="lg" className="min-h-16" disabled={isSearching || !value.trim()}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">Examples</span>
        {examples.map((word) => (
          <button
            key={word}
            type="button"
            className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:opacity-60"
            onClick={() => {
              setValue(word)
              onSearch(word)
            }}
            disabled={isSearching}
          >
            {word}
          </button>
        ))}
      </div>
    </section>
  )
}
