import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { type Metadata } from "next"
import { ThemeProvider } from "next-themes"

import { Toaster } from "@/components/ui/sonner"
import "@/styles/globals.css"

import { Navbar } from "./_components/navbar"
import { SessionProvider } from "./_components/session-provider"

export const metadata: Metadata = {
  title: "easyshell - practice your shell",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex h-screen flex-col font-geist ">
        <ThemeProvider attribute="class" defaultTheme="light">
          <SessionProvider>
            <Toaster />
            <Navbar />
            <div className="grow">{children}</div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
