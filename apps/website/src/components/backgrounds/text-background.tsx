import { cn } from "@/lib/utils"

export function TextBackground({
  text,
  children,
  className,
}: {
  text: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative overflow-hidden bg-neutral-100", className)}>
      <div className="text-md font-clash-display font-bold text-neutral-300 *:flex *:gap-4 absolute top-0 left-0 flex flex-col *:flex-nowrap text-nowrap">
        <div className="animate-text-loop-left">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
        <div className="animate-text-loop-right">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
        <div className="animate-text-loop-left">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
        <div className="animate-text-loop-right">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
      </div>

      {children}
    </div>
  )
}
