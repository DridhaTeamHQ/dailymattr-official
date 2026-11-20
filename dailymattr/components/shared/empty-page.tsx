/**
 * Placeholder for a page whose route exists (so footer and nav links resolve) but whose design
 * isn't built yet. It shows nothing but white space above the footer; the heading is for
 * screen readers only.
 */
export function EmptyPage({ title }: { title: string }) {
  return (
    <main className="min-h-[60svh] flex-1 bg-white">
      <h1 className="sr-only">{title}</h1>
    </main>
  )
}
