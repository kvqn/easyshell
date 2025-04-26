"use client"

import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/lib/client"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Switch
      checked={theme === "dark"}
      onCheckedChange={(checked) => {
        setTheme(checked ? "dark" : "light")
      }}
    />
  )
}
