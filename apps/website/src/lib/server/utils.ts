import { headers } from "next/headers"

export function getPathname() {
  return headers().get("x-pathname") ?? "/"
}
