import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function BadgeButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <Badge
      className={cn(
        "flex cursor-pointer items-center justify-between gap-1 rounded-full dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Badge>
  )
}
