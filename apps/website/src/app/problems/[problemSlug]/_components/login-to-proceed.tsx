"use client"

import { Button } from "@/components/ui/button"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function LoginToProceed() {
  const pathname = usePathname()
  return (
    <div className="my-auto flex h-full w-full flex-grow items-center justify-center">
      <Link href={`/login?callback=${pathname}`}>
        <Button className="px-8">Login</Button>
      </Link>
    </div>
  )
}
