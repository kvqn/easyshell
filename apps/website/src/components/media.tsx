import { cn } from "@/lib/utils"

export function DesktopContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("hidden h-full w-full md:block", className)}>
      {children}
    </div>
  )
}

export function MobileContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("block h-full w-full md:hidden", className)}>
      {children}
    </div>
  )
}
