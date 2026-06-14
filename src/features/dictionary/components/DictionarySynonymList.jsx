import Badge from '@/components/ui/Badge'

export default function DictionarySynonymList({ title, words, emptyLabel, variant = 'secondary' }) {
  return (
    <section className="rounded-card border border-border bg-card p-5 shadow-sm">
      <h3 className="text-xl font-semibold">{title}</h3>
      {words.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {words.map((word) => <Badge key={word} variant={variant}>{word}</Badge>)}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </section>
  )
}
