import { Link, Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-border bg-card shadow-sm lg:grid-cols-[1fr_460px]">
          <section className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.28),transparent_26%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,0.24),transparent_28%),linear-gradient(145deg,rgba(37,99,235,1),rgba(14,116,144,0.86))]" />
            <div className="relative">
              <Link to="/login" className="inline-flex items-center gap-3 text-lg font-bold">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/18">VV</span>
                VocabVerse
              </Link>
              <h1 className="mt-16 max-w-xl text-5xl font-bold leading-tight tracking-tight">
                Build vocabulary habits that actually stick.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-white/82">
                A focused learning workspace for collections, spaced review, flashcards, quiz practice, AI roleplay, and shadowing.
              </p>
            </div>
            <div className="relative grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/14 p-4 backdrop-blur">
                <p className="text-2xl font-bold">320</p>
                <p className="mt-1 text-sm text-white/75">Words learned</p>
              </div>
              <div className="rounded-2xl bg-white/14 p-4 backdrop-blur">
                <p className="text-2xl font-bold">12d</p>
                <p className="mt-1 text-sm text-white/75">Current streak</p>
              </div>
              <div className="rounded-2xl bg-white/14 p-4 backdrop-blur">
                <p className="text-2xl font-bold">82%</p>
                <p className="mt-1 text-sm text-white/75">Quiz accuracy</p>
              </div>
            </div>
          </section>
          <section className="p-6 sm:p-8 lg:p-10">
            <Outlet />
          </section>
        </div>
      </div>
    </main>
  )
}
