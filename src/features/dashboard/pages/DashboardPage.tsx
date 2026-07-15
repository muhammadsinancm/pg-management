import { Building2, Layers3, ShieldCheck } from 'lucide-react'

export function DashboardPage(): React.JSX.Element {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Enter screen
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-foreground">
          Ready for your PG workspace
        </h2>
        <p className="max-w-2xl text-base text-muted-foreground">
          On-premise desktop shell for your account. Add rooms, payments, bookings, and
          hardware from the folders documented in ARCHITECTURE.md. Firebase will back
          auth and data for this user.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border/80 bg-card p-5">
          <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
          <h3 className="font-semibold">Auth ready</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Local session now; swap to Firebase via services/firebase.
          </p>
        </div>
        <div className="rounded-lg border border-border/80 bg-card p-5">
          <Layers3 className="mb-3 h-5 w-5 text-primary" />
          <h3 className="font-semibold">Feature folders</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            PG modules wait under src/features/pg with clear recipes.
          </p>
        </div>
        <div className="rounded-lg border border-border/80 bg-card p-5">
          <Building2 className="mb-3 h-5 w-5 text-primary" />
          <h3 className="font-semibold">Hardware path</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            IPC stubs live in electron/main — wire devices when needed.
          </p>
        </div>
      </section>
    </div>
  )
}
