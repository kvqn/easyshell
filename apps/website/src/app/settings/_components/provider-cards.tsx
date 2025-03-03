"use client"

import { signIn } from "next-auth/react"
import {
  PiDiscordLogo,
  PiDiscordLogoDuotone,
  PiGithubLogo,
  PiGithubLogoDuotone,
  PiGoogleLogo,
  PiGoogleLogoDuotone,
} from "react-icons/pi"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

type ProviderType = "discord" | "github" | "google"

interface ProviderCardProps {
  provider: ProviderType
  connected: boolean
}

export function ProviderCard({ provider, connected }: ProviderCardProps) {
  const icons = {
    discord: {
      connected: <PiDiscordLogoDuotone className="w-6 h-6" />,
      disconnected: <PiDiscordLogo className="w-6 h-6" />,
    },
    github: {
      connected: <PiGithubLogoDuotone className="w-6 h-6" />,
      disconnected: <PiGithubLogo className="w-6 h-6" />,
    },
    google: {
      connected: <PiGoogleLogoDuotone className="w-6 h-6" />,
      disconnected: <PiGoogleLogo className="w-6 h-6" />,
    },
  }

  const providerNames = {
    discord: "Discord",
    github: "GitHub",
    google: "Google",
  }

  return (
    <div
      className="pl-4 pr-6 py-2 flex items-center border rounded-full shadow bg-neutral-50 gap-2 cursor-pointer hover:bg-neutral-100 transition-colors"
      onClick={async () => {
        if (connected) {
          toast.success("Already Connected", {
            description: `You're already connected to ${providerNames[provider]}.`,
          })
          return
        }
        await signIn(provider)
      }}
    >
      {connected ? icons[provider].connected : icons[provider].disconnected}
      <div className="flex flex-col items-center">
        <p className="font-semibold">{providerNames[provider]}</p>
        <p
          className={cn("text-xs text-neutral-400", {
            "text-emerald-600": connected,
          })}
        >
          {connected ? "Connected" : "Not connected"}
        </p>
      </div>
    </div>
  )
}

export function DiscordCard({ connected }: { connected: boolean }) {
  return <ProviderCard provider="discord" connected={connected} />
}

export function GithubCard({ connected }: { connected: boolean }) {
  return <ProviderCard provider="github" connected={connected} />
}

export function GoogleCard({ connected }: { connected: boolean }) {
  return <ProviderCard provider="google" connected={connected} />
}
