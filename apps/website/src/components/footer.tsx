import { cn } from "@/lib/utils"

import Link from "next/link"

export function Footer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full border-t border-neutral-200 bg-neutral-100 px-4 py-2 text-center text-xs text-neutral-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400",
        className,
      )}
      id="footer"
    >
      {`Built by `}
      <Link
        href="https://x.com/kvqn_dev"
        className="inline underline underline-offset-2"
        target="_blank"
      >
        Guneet
      </Link>
      {`. Source code on `}
      <Link
        href="https://github.com/kvqn/easyshell"
        className="inline underline underline-offset-2"
        target="_blank"
      >
        GitHub
      </Link>
      {`. All feedback is welcome!`}
    </div>
  )
}
