"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/client"

import { PiMoon, PiMoonDuotone, PiSun, PiSunDuotone } from "react-icons/pi"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="outline"
      className="group flex-grow"
      onClick={() => {
        if (theme === "light") setTheme("dark")
        else setTheme("light")
      }}
    >
      <div className="relative size-4">
        {theme === "light" ? (
          <>
            <PiSun className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity group-hover:opacity-0" />
            <PiSunDuotone className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-100" />
          </>
        ) : (
          <>
            <PiMoon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity group-hover:opacity-0" />
            <PiMoonDuotone className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-100" />
          </>
        )}
      </div>
    </Button>
  )
}
