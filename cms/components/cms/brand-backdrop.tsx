import { BrandMark } from "@/components/cms/brand-mark"

/** Sign-in and verification screens: the brand above a centred card, on a light grey page. */
export function BrandBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted/50 px-4 py-16">
      <BrandMark size="lg" />
      {children}
    </main>
  )
}
