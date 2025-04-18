import { useSession } from "next-auth/react"
import { useTheme as _useTheme } from "next-themes"

// TODO: remove this
export function useUser() {
  const { data: session } = useSession()
  return session?.user
}

export function useTheme() {
  const { theme: _theme, setTheme: _setTheme } = _useTheme()

  function setTheme(t: "light" | "dark") {
    _setTheme(t)
  }

  return {
    theme: _theme === "dark" || _theme === "light" ? _theme : "light",
    setTheme,
  }
}

export function clientOS() {
  if (typeof window === "undefined") {
    return "unknown"
  }

  const userAgent = window.navigator.userAgent.toLowerCase()
  if (userAgent.includes("windows")) {
    return "windows"
  } else if (userAgent.includes("macintosh")) {
    return "mac"
  } else if (userAgent.includes("linux")) {
    return "linux"
  } else if (userAgent.includes("android")) {
    return "android"
  } else if (userAgent.includes("iphone")) {
    return "ios"
  } else if (userAgent.includes("ipad")) {
    return "ios"
  } else if (userAgent.includes("ipod")) {
    return "ios"
  }
  return "unknown"
}
