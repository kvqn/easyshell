"use client"

import { Button } from "@/components/ui/button"
import { cn, max, min, sleep } from "@/lib/utils"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { PiGithubLogo, PiGithubLogoDuotone } from "react-icons/pi"

export default function HomePage() {
  const [animationDone, setAnimationDone] = useState(false)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="fixed top-0 left-0 -z-10 h-full w-full">
        <div className="relative h-full w-full overflow-hidden">
          <div className="animate-blob absolute top-0 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full bg-emerald-100 opacity-70 mix-blend-multiply blur-xl filter duration-[20s] dark:bg-emerald-900 dark:opacity-5 dark:mix-blend-multiply" />
          <div className="animate-blob absolute right-1/2 bottom-0 h-[150%] w-[150%] translate-x-1/2 translate-y-1/2 animate-spin rounded-full bg-emerald-100 opacity-70 mix-blend-multiply blur-xl filter duration-[30s] dark:bg-emerald-900 dark:opacity-5 dark:mix-blend-multiply" />
        </div>
      </div>
      <Heading setAnimationDone={setAnimationDone} />
      <div
        className={cn(
          "flex flex-col items-center gap-4 opacity-0 transition-opacity",
          {
            "opacity-100": animationDone,
          },
        )}
      >
        <Tagline />
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <Link href="/browse">
            <Button>Explore Problems</Button>
          </Link>
          <Link href="https://github.com/kvqn/easyshell">
            <Button
              className="group flex items-center gap-2 dark:hover:bg-neutral-700"
              variant="secondary"
            >
              <div className="relative h-8 w-6">
                <PiGithubLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity group-hover:opacity-0" />
                <PiGithubLogoDuotone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              View on GitHub
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function Heading({
  setAnimationDone,
}: {
  setAnimationDone: (done: boolean) => void
}) {
  const text1 = useRef<HTMLParagraphElement>(null)
  const text2 = useRef<HTMLParagraphElement>(null)
  const text3 = useRef<HTMLParagraphElement>(null)
  const blinker = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    void (async () => {
      const FINAL_TEXT_1 = "Welcome to"
      const FINAL_TEXT_2 = "easy"
      const FINAL_TEXT_3 = "shell"
      const MAX_TICKS =
        FINAL_TEXT_1.length + FINAL_TEXT_2.length + FINAL_TEXT_3.length
      let tick = 0
      while (true) {
        await sleep(100 + Math.random() * 100)
        tick++
        if (text1.current)
          text1.current.textContent = FINAL_TEXT_1.slice(
            0,
            min(tick, FINAL_TEXT_1.length),
          )
        if (text2.current)
          text2.current.textContent = FINAL_TEXT_2.slice(
            0,
            min(max(0, tick - FINAL_TEXT_1.length), FINAL_TEXT_2.length),
          )
        if (text3.current)
          text3.current.textContent = FINAL_TEXT_3.slice(
            0,
            min(
              max(0, tick - FINAL_TEXT_1.length - FINAL_TEXT_2.length),
              FINAL_TEXT_3.length,
            ),
          )

        if (tick > MAX_TICKS) {
          setAnimationDone(true)
          break
        }
      }
      while (true) {
        await sleep(100)
        tick++
        if (blinker.current) {
          if (Math.floor(tick / 5) % 2) blinker.current.style.opacity = "0"
          else blinker.current.style.opacity = "100"
        }
      }
    })()
  }, [setAnimationDone])

  return (
    <h1 className="flex text-3xl font-bold lg:text-7xl">
      <p ref={text1} className="mr-2 lg:mr-6" />
      <p ref={text2} className="" />
      <p ref={text3} className="text-emerald-500" />
      <p ref={blinker}>_</p>
    </h1>
  )
}

const taglines = [
  "Become a terminal ninja",
  "Master the art of shell scripting",
  "Terminal is not magic, it's just a tool",
  "Make the terminal your playground",
]

function Tagline() {
  const randomSortedTaglines = taglines.sort(() => Math.random() - 0.5)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    void (async () => {
      while (!ref.current) continue
      ref.current.textContent = randomSortedTaglines[0]!
      let i = 0
      while (true) {
        await sleep(5000)
        i++
        if (ref.current) {
          ref.current.style.opacity = "0"
          await sleep(100)
          ref.current.textContent =
            randomSortedTaglines[i % randomSortedTaglines.length]!
          ref.current.style.opacity = "100"
        }
      }
    })()
  }, [randomSortedTaglines])

  return (
    <p
      ref={ref}
      className="text-2xl font-thin text-neutral-500 transition-opacity lg:text-4xl"
    />
  )
}
