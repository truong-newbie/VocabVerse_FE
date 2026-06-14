import { FiExternalLink, FiKey } from 'react-icons/fi'

export default function GroqApiKeyCard({ value, onChange, disabled }) {
  return (
    <section className="rounded-card border border-border bg-muted/45 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FiKey aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold">Use your own Groq API key</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Paste a Groq key from your account. The key is kept only in memory while this dialog is open and is sent only to the VocabVerse backend normalize-bulk endpoint.
            </p>
          </div>
        </div>
        <a
          href="https://console.groq.com/keys"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-button border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          <FiExternalLink aria-hidden="true" /> Get Groq API Key
        </a>
      </div>

      <label className="mt-4 block text-sm font-semibold text-foreground" htmlFor="groq-api-key">Groq API key</label>
      <input
        id="groq-api-key"
        type="password"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder="gsk_..."
        className="mt-2 h-12 w-full rounded-button border border-input bg-background px-4 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
      />
      <p className="mt-2 text-xs text-muted-foreground">Not saved to localStorage. Do not share this key with other users.</p>
    </section>
  )
}
