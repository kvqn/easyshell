// ====================================================
// Utility function that can be used ONLY on the server
// ====================================================
import { headers } from "next/headers"

export function getPathname() {
  return headers().get("x-pathname") ?? "/"
}
