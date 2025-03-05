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
