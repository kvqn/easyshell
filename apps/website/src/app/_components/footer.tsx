import Link from "next/link"

export function Footer() {
  return (
    <div className="w-full border-t border-neutral-200 bg-neutral-100 px-4 py-2 text-center text-xs text-neutral-500 sm:text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500">
      {`Built by `}
      <Link
        href="https://x.com/kvqn_dev"
        className="inline underline underline-offset-2"
      >
        Guneet
      </Link>
      {`. Source code on `}
      <Link
        href="https://github.com/kvqn/easyshell"
        className="inline underline underline-offset-2"
      >
        GitHub
      </Link>
      {`. All feedback is welcome!`}
    </div>
  )
}
