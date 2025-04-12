import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { auth } from "@/lib/server/auth"

import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import Link from "next/link"

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
        className="mt-1 hidden text-gray-500 transition-colors hover:text-black lg:block"
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
        <div className="flex w-full flex-col">
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
        <div className="flex w-fit gap-2 rounded-md border px-4 py-2">
          <Avatar className="mr-1.5 h-6 w-6">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback>{user.name![0]}</AvatarFallback>
          </Avatar>
          <p>{user.name}</p>
        </div>

        <Link href="/settings" className="w-full">
          <Button variant="outline" className="mt-2 w-full">
            Settings
          </Button>
        </Link>

        <Link href="/logout" className="w-full">
          <Button variant="outline" className="mt-2 w-full">
            Logout
          </Button>
        </Link>
      </div>
    )

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="rounded-md border border-neutral-200 px-4 py-2 text-neutral-500">
        Not logged in
      </p>
      <Link href="/login" className="w-full">
        <Button className="w-full">Login</Button>
      </Link>
    </div>
  )
}
