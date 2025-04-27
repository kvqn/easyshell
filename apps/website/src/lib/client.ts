// ====================================================
// Utility function that can be used ONLY on the client
// ====================================================
import { useTheme as _useTheme } from "next-themes"

export function useTheme() {
  const { theme: _theme, setTheme: _setTheme } = _useTheme()

  function setTheme(t: "light" | "dark") {
    _setTheme(t)
  }

  const theme: "light" | "dark" =
    _theme === "dark" || _theme === "light" ? _theme : "light"

  return {
    theme: theme,
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

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>
