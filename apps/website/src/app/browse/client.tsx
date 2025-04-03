"use client"

import { ProblemDifficulty, ProblemStatus } from "@/components/problem-status"
import { Input } from "@/components/ui/input"
import { EasyTooltip } from "@/components/ui/tooltip"
import type { getPublicProblemInfo } from "@/lib/server/problems"
import { cn } from "@/lib/utils"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { PiMagnifyingGlass, PiMagnifyingGlassDuotone } from "react-icons/pi"

export function ProblemList({
  problems,
}: {
  problems: Array<
    Awaited<ReturnType<typeof getPublicProblemInfo>> & {
      status?: "attempted" | "solved"
    }
  >
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [filter, setFilter] = useState<{ search: string }>({ search: "" })

  const [filteredProblems, setFilteredProblems] = useState(problems)

  useEffect(() => {
    setFilteredProblems(
      problems.filter((problem) =>
        problem.slug
          .toLowerCase()
          .replaceAll("-", "")
          .includes(
            filter.search.toLowerCase().replaceAll("-", "").replaceAll(" ", ""),
          ),
      ),
    )
  }, [filter, problems])

  return (
    <div className="w-full divide-y rounded-xl border overflow-hidden border-neutral-400">
      <div className="divide-x divide-neutral-300 *:p-2 flex font-semibold bg-gray-50 border-b border-b-neutral-400">
        <div className="w-20 text-center">#</div>
        <div className="grow flex justify-between items-center">
          <p className="grow">Title</p>
          <div className="flex gap-2 items-center">
            <div
              className={cn("transition-all w-0", {
                "w-60 px-2": searchOpen,
                "overflow-hidden": !searchOpen,
              })}
            >
              <Input
                ref={searchRef}
                className="h-6 px-2 py-0 font-normal outline-none ring-0"
                value={filter.search}
                onChange={(e) => {
                  setFilter((prev) => ({ ...prev, search: e.target.value }))
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false)
                  e.stopPropagation()
                }}
              />
            </div>
            <EasyTooltip tip="Search">
              <div
                className="relative h-4 w-4 cursor-pointer"
                onClick={() => {
                  if (searchOpen) {
                    searchRef.current?.blur()
                  } else {
                    searchRef.current?.focus()
                  }
                  setSearchOpen((prev) => !prev)
                }}
              >
                <PiMagnifyingGlass
                  className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity opacity-100 h-4 w-4",
                    {
                      "opacity-0": searchOpen,
                    },
                  )}
                />
                <PiMagnifyingGlassDuotone
                  className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity opacity-0 h-4 w-4",
                    { "opacity-100": searchOpen },
                  )}
                />
              </div>
            </EasyTooltip>
          </div>
        </div>
        <div className="w-10 lg:w-20 text-center">Status</div>
      </div>
      <div className="divide-y">
        {filteredProblems.map((problem) => (
          <Problem key={problem.id} info={problem} />
        ))}
      </div>
    </div>
  )
}

function Problem({
  info,
}: {
  info: Awaited<ReturnType<typeof getPublicProblemInfo>> & {
    status?: "attempted" | "solved"
  }
}) {
  return (
    <Link
      href={`/problems/${info.slug}`}
      className="cursor-pointer divide-x transition-colors *:p-2 hover:bg-gray-100 flex"
    >
      <div className="w-20 text-center">{info.id}</div>
      <div className="grow flex items-center">
        <span className="grow">{info.slug}</span>
        <ProblemDifficulty difficulty={info.difficulty} />
      </div>
      <div className="w-10 lg:w-20 flex items-center justify-center">
        <ProblemStatus status={info.status} />
      </div>
    </Link>
  )
}
