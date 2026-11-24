import { CircleAlert, CircleCheck, ListChecks } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { SectionTitle } from "@/components/cms/section-title"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import type { SeoCheck } from "@/lib/seo/fields"

export function ChecksCard({ checks }: { checks: SeoCheck[] }) {
  const passed = checks.filter((check) => check.passed).length

  return (
    <Card size="sm">
      <CardHeader>
        <SectionTitle icon={ListChecks} tone="green">SEO checks</SectionTitle>
        <CardAction>
          <Badge variant={passed === checks.length ? "success" : "warning"} className="tabular-nums">
            {passed}/{checks.length}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3">
          {checks.map((check) => (
            <li key={check.label} className="flex gap-2.5">
              {check.passed ? (
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-label="Passed" />
              ) : (
                <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-label="Needs work" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium">{check.label}</p>
                <p className="text-xs text-muted-foreground">{check.hint}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
