import { Skeleton } from "@/components/ui/skeleton"

export function EditorSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-14 w-80" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Skeleton className="h-[32rem]" />
        <Skeleton className="h-96" />
      </div>
    </div>
  )
}
