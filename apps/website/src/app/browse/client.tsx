"use client"

import { BadgeCheckbox } from "@/components/badge-checkbox"
import { ProblemDifficulty, ProblemStatus } from "@/components/problem-status"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { EasyTooltip } from "@/components/ui/tooltip"
import type { getPublicProblemInfo } from "@/lib/server/problems"
import { cn } from "@/lib/utils"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { PiMagnifyingGlass, PiMagnifyingGlassDuotone } from "react-icons/pi"

export function ProblemList({
  problems,
  tags,
}: {
  problems: Array<
    Awaited<ReturnType<typeof getPublicProblemInfo>> & {
      status?: "attempted" | "solved"
    }
  >
  tags: Array<string>
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [filter, setFilter] = useState<{
    search: string
    difficulty: { easy: boolean; medium: boolean; hard: boolean }
    tags: Set<string>
  }>({
    search: "",
    difficulty: { easy: true, medium: true, hard: true },
    tags: new Set(tags),
  })

  const [filteredProblems, setFilteredProblems] = useState(problems)

  useEffect(() => {
    setFilteredProblems(
      problems.filter(
        (problem) =>
          problem.slug
            .toLowerCase()
            .replaceAll("-", "")
            .includes(
              filter.search
                .toLowerCase()
                .replaceAll("-", "")
                .replaceAll(" ", ""),
            ) &&
          filter.difficulty[problem.difficulty] &&
          new Set(problem.tags).intersection(filter.tags).size > 0,
      ),
    )
  }, [filter, problems])

  const difficulties = ["easy", "medium", "hard"] as const

  return (
    <div className="flex gap-4">
      <div className="w-full divide-y rounded-xl border overflow-hidden border-neutral-400 flex flex-col h-fit">
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
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
              <Problem key={problem.id} info={problem} />
            ))
          ) : (
            <div className="h-40 w-full flex items-center justify-center text-neutral-400 text-xl">
              What are you looking for?
            </div>
          )}
        </div>
      </div>
      <div className="w-60 flex flex-col gap-4">
        <div className="text-center font-bold text-xl text-neutral-500">
          FILTERS
        </div>
        <Card className="py-2 px-4">
          <div className="font-semibold text-neutral-400 text-sm text-center">
            DIFFICULTY
          </div>
          <div className="flex flex-col gap-1 items-center my-2">
            {difficulties.map((d) => (
              <BadgeCheckbox
                key={d}
                value={filter.difficulty[d]}
                onValueChange={(val) => {
                  setFilter((prev) => ({
                    ...prev,
                    difficulty: { ...prev.difficulty, [d]: val },
                  }))
                }}
                className={cn({
                  "bg-emerald-100 text-emerald-600 hover:bg-emerald-200":
                    d === "easy",
                  "bg-orange-100 text-orange-600 hover:bg-orange-200":
                    d === "medium",
                  "bg-rose-100 text-rose-600 hover:bg-rose-200": d === "hard",
                })}
              >
                {d}
              </BadgeCheckbox>
            ))}
          </div>
        </Card>
        <Card className="py-2 px-4">
          <div className="font-semibold text-neutral-400 text-sm text-center">
            TAGS
          </div>
          <div className="flex justify-between px-4">
            <button
              className="text-neutral-300 text-xs hover:underline hover:text-neutral-400 transition-all cursor-pointer"
              onClick={() => {
                setFilter((prev) => ({
                  ...prev,
                  tags: new Set(tags),
                }))
              }}
            >
              Select All
            </button>
            <button
              className="text-neutral-300 text-xs hover:underline hover:text-neutral-400 transition-all cursor-pointer"
              onClick={() => {
                setFilter((prev) => ({
                  ...prev,
                  tags: new Set(),
                }))
              }}
            >
              Clear All
            </button>
          </div>
          <div className="flex gap-2 items-center my-2 flex-wrap justify-center">
            {tags.map((t) => (
              <BadgeCheckbox
                key={t}
                value={filter.tags.has(t)}
                onValueChange={(val) => {
                  setFilter((prev) => ({
                    ...prev,
                    tags: new Set(
                      val
                        ? [...prev.tags, t]
                        : [...prev.tags].filter((tag) => tag !== t),
                    ),
                  }))
                }}
                className="w-16"
              >
                {t}
              </BadgeCheckbox>
            ))}
          </div>
        </Card>
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
