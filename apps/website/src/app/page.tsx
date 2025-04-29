import { Footer } from "./_components/footer"

import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="px-4 pt-16 text-center">
        <span className="font-clash-display text-3xl font-medium sm:text-4xl lg:text-5xl">
          {`Using the terminal should be `}
        </span>
        <span className="font-clash-display text-3xl font-semibold italic underline underline-offset-8 sm:text-4xl lg:text-5xl">
          easy
        </span>
        <span className="font-clash-display text-3xl font-medium sm:text-4xl lg:text-5xl">
          .
        </span>
      </div>
      <div className="mt-2 px-4 text-center font-clash-display text-base sm:mt-4 sm:text-xl lg:mt-8 lg:text-2xl">
        Level up your terminal skills with our interactive shell challenges.
      </div>
      <div className="mt-16 flex items-center justify-center gap-8">
        <div className="rounded-md bg-neutral-200 p-4 font-clash-display transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700">
          Tell me more
        </div>
        <Link
          href="/browse"
          className="group relative overflow-hidden rounded-md bg-neutral-950 p-4 font-clash-display text-black transition-colors dark:bg-white dark:text-white"
        >
          Get Started
          <div className="absolute top-0 left-0 z-5 h-full w-0 bg-neutral-800 transition-all ease-in group-hover:w-full dark:bg-neutral-200" />
          <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-white dark:text-black">
            Get Started
          </div>
        </Link>
      </div>
      <div className="mt-16 mb-16 grid w-5/6 grid-cols-1 gap-8 *:mx-auto sm:grid-cols-2 *:sm:mx-0 lg:grid-cols-3">
        <Card
          title="Live Terminal"
          description="Practice your skills on a terminal in your browser"
        />
        <Card
          title="Varying Difficulty"
          description="Choose from a range of challenges, from beginner to advanced"
        />
        <Card
          title="Varying Difficulty"
          description="Choose from a range of challenges, from beginner to advanced"
        />
      </div>
      <Footer />
    </div>
  )
}

function Card({
  image,
  title,
  description,
}: {
  image?: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-80 rounded-xl border bg-neutral-50 p-4 shadow dark:bg-neutral-950/50">
      <div className="flex aspect-square items-center justify-center rounded-md bg-neutral-200 font-clash-display dark:bg-neutral-800/30">
        {`<insert image>`}
      </div>
      <div className="mt-4 font-medium">{title}</div>
      <div className="mt-2 text-sm text-neutral-500">{description}</div>
    </div>
  )
}
