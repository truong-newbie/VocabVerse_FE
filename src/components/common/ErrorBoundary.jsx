import { Component } from 'react'
import { FiAlertTriangle, FiHome, FiRefreshCw } from 'react-icons/fi'
import Button from '@/components/ui/Button'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Unhandled render error:', error, errorInfo)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleBackToDashboard = () => {
    window.location.assign('/dashboard')
  }

  render() {
    if (!this.state.error) {
      return this.props.children
    }

    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
        <section className="w-full max-w-2xl rounded-[28px] border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
            <FiAlertTriangle aria-hidden="true" className="h-8 w-8" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-destructive">Application error</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Something interrupted VocabVerse</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            The app hit an unexpected rendering problem. Reload the workspace or return to the dashboard to continue learning.
          </p>
          {import.meta.env.DEV ? (
            <pre className="mt-5 max-h-36 overflow-auto rounded-2xl bg-muted p-4 text-left text-xs text-muted-foreground">
              {this.state.error?.message}
            </pre>
          ) : null}
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={this.handleReload}>
              <FiRefreshCw aria-hidden="true" /> Reload
            </Button>
            <Button variant="secondary" onClick={this.handleBackToDashboard}>
              <FiHome aria-hidden="true" /> Back to Dashboard
            </Button>
          </div>
        </section>
      </main>
    )
  }
}
