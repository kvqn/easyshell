"use client"

import { Switch } from "@/components/ui/switch"

import { toast } from "sonner"

export function ThemeToggle() {
  return (
    <Switch
      checked={false}
      onCheckedChange={() => {
        toast.info("Sorry, you can't change theme at this moment", {
          description: "This feature is not yet implemented.",
        })
      }}
    />
  )
}
