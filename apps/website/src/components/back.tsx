import Link from "next/link"
import { IoIosArrowBack } from "react-icons/io"

export function Back({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 pl-2 border rounded-md w-fit group bg-neutral-50 hover:bg-neutral-100 transition-colors border-neutral-300 shadow-xs text-neutral-500 hover:text-neutral-600"
    >
      <IoIosArrowBack className="m-0 p-0 group-hover:-translate-x-0.5 transition-transform w-4 h-4" />
      <p className="mr-4">Back</p>
    </Link>
  )
}
