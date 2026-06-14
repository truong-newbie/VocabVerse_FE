import Badge from '@/components/ui/Badge'

export default function DictionaryMeaningCard({ meaning }) {
  return (
    <article className="rounded-card border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="primary">{meaning.partOfSpeech || 'Meaning'}</Badge>
        <Badge variant="secondary">{meaning.definitions.length} definitions</Badge>
      </div>

      <div className="mt-5 space-y-5">
        {meaning.definitions.map((definition, index) => (
          <div key={`${definition.definition}-${index}`} className="border-t border-border pt-5 first:border-t-0 first:pt-0">
            <p className="text-lg font-semibold leading-8 text-foreground">{definition.definition}</p>
            {definition.example ? (
              <div className="mt-3 rounded-2xl bg-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Example</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{definition.example}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </article>
  )
}
