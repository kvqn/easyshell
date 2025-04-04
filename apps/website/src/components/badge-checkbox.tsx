import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { IoMdCheckmark } from "react-icons/io"
import { RxCross2 } from "react-icons/rx"

export function BadgeCheckbox({
  children,
  value,
  onValueChange,
  className,
}: {
  children: React.ReactNode
  value: boolean
  onValueChange: (value: boolean) => void
  className?: string
}) {
  return (
    <Badge
      className={cn(
        "flex items-center gap-1 rounded-full cursor-pointer justify-between",
        className,
      )}
      onClick={() => {
        onValueChange(!value)
      }}
    >
      <span className="grow text-center">{children}</span>
      {value ? <IoMdCheckmark /> : <RxCross2 />}
    </Badge>
  )
}
