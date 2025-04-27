import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { auth } from "@/lib/server/auth"

import { ThemeToggle } from "./theme-toggle"

import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { PiGear, PiGearDuotone } from "react-icons/pi"

function Logo() {
  return (
    <Link className="text-xl lg:text-2xl" href="/">
      <span className="font-bold">easy</span>
      <span className="font-bold text-green-500">shell</span>
    </Link>
  )
}

export function Navbar() {
  return (
    <div className="flex items-center gap-8 bg-transparent px-4 py-2">
      <Logo />
      <Link
        href="/problems"
        className="mt-1 hidden text-neutral-500 transition-colors hover:text-black lg:block dark:hover:text-white"
      >
        Problems
      </Link>
      <div className="ml-auto">
        <Options />
      </div>
    </div>
  )
}

function Options() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="p-2">
          <HamburgerMenuIcon width="1.5rem" height="1.5rem" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="flex w-full flex-col gap-2">
          <div className="flex justify-between gap-2 *:grow">
            <Link href="/settings">
              <Button
                variant="outline"
                className="group flex w-full items-center justify-center"
              >
                <div className="relative size-4">
                  <PiGear className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity group-hover:opacity-0" />
                  <PiGearDuotone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <User />
        </div>
      </PopoverContent>
    </Popover>
  )
}

async function User() {
  const user = (await auth())?.user
  if (user)
    return (
      <div className="flex w-full flex-col">
        <Link href={`/profile/${user.username}`}>
          <Button
            variant="outline"
            className="flex w-full gap-1 rounded-md border px-2 py-2"
          >
            <Avatar className="mr-1.5 h-6 w-6">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <p>{user.username}</p>
          </Button>
        </Link>

        <Link href="/logout" className="mt-2 w-full">
          <Button variant="outline" className="w-full">
            Logout
          </Button>
        </Link>
      </div>
    )

  return (
    <div className="flex w-full flex-col">
      <p className="rounded-md border px-4 py-2 text-neutral-500">
        Not logged in
      </p>
      <Link href="/login" className="mt-2 w-full">
        <Button className="w-full">Login</Button>
      </Link>
    </div>
  )
}
