"use client"

import { env } from "@/env"

import dynamic from "next/dynamic"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

const PostHogPageView = dynamic(() => import("./posthog-pageview"), {
  ssr: false,
})

export function ClientSideProviders({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  )
}
