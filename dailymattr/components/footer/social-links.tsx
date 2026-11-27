import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

// The footer's social links: dailymattr on X, LinkedIn, Instagram and YouTube, shown as bare
// icons under the Legal and Support columns (above the app badges on phones). The icons are
// the old site's footer icons (24px viewBox), drawn in the footer link colour.

const icons = {
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.3-8.5L1 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.6 3.9H4.8L17.8 20Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
      <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.53 2.79-1.53 2.98 0 3.58 1.96 3.58 4.51v5.27Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden className="size-5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden className="size-5">
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
    </svg>
  ),
}

const links = [
  { key: "x", label: "X", href: site.social.x },
  { key: "linkedin", label: "LinkedIn", href: site.social.linkedin },
  { key: "instagram", label: "Instagram", href: site.social.instagram },
  { key: "youtube", label: "YouTube", href: site.social.youtube },
] as const

/** `spread`: the icons fill the row's width, first at its start and last at its end. */
export function FooterSocialLinks({ spread, className }: { spread?: boolean; className?: string }) {
  return (
    <nav aria-label="Social media" className={className}>
      <ul className={cn("flex items-center", spread ? "justify-between" : "gap-5")}>
        {links.map((l) => (
          <li key={l.key}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`dailymattr on ${l.label} (opens in a new tab)`}
              title={l.label}
              className="-m-1 flex p-1 text-[#696969] transition-colors hover:text-foreground [.theme-nia_&]:text-white/55 [.theme-nia_&]:hover:text-white"
            >
              {icons[l.key]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
