import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex max-w-3xl flex-col items-center text-center", className)}>
      {eyebrow && (
        <p className="mb-4 text-xs font-medium tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
