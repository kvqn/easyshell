"use client"

import { BadgeCheckbox } from "@/components/badge-checkbox"
import { ProblemDifficulty, ProblemStatus } from "@/components/problem-status"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { getPublicProblemInfo } from "@/lib/server/problems"
import { cn } from "@/lib/utils"

import Link from "next/link"
import { useEffect, useState } from "react"
import { PiMagnifyingGlass } from "react-icons/pi"

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
  const [filter, setFilter] = useState<{
    search: string
    difficulty: { easy: boolean; medium: boolean; hard: boolean }
    tags: Set<string>
  }>({
    search: "",
    difficulty: { easy: true, medium: true, hard: true },
    tags: new Set(tags),
  })

  const [options, setOptions] = useState<{ showTags: boolean }>({
    showTags: false,
  })

  const [filteredProblems, setFilteredProblems] = useState(problems)

  useEffect(() => {
    setFilteredProblems(
      problems.filter(
        (problem) =>
          (problem.slug
            .toLowerCase()
            .replaceAll("-", "")
            .includes(
              filter.search
                .toLowerCase()
                .replaceAll("-", "")
                .replaceAll(" ", ""),
            ) ||
            problem.title
              .toLowerCase()
              .replaceAll(" ", "")
              .includes(
                filter.search
                  .toLowerCase()
                  .replaceAll("-", "")
                  .replaceAll(" ", ""),
              )) &&
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
          </div>
          <div className="w-10 lg:w-20 text-center">Status</div>
        </div>
        <div className="divide-y">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
              <Problem
                key={problem.id}
                info={problem}
                showTags={options.showTags}
              />
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
            OPTIONS
          </div>
          <div className="flex items-center justify-center gap-2 my-2 flex-col">
            <div className="relative">
              <Input
                className="h-8 text-neutral-500 placeholder:text-neutral-400"
                placeholder="Search"
                value={filter.search}
                onChange={(e) => {
                  setFilter((prev) => ({ ...prev, search: e.target.value }))
                }}
              />
              <PiMagnifyingGlass className="absolute top-1/2 -translate-y-1/2 right-2 text-neutral-400" />
            </div>
            <BadgeCheckbox
              value={options.showTags}
              onValueChange={(val) => {
                setOptions((prev) => ({
                  ...prev,
                  showTags: val,
                }))
              }}
              className="text-white bg-neutral-800 hover:bg-neutral-700"
            >
              Show Tags
            </BadgeCheckbox>
          </div>
        </Card>
        <Card className="py-2 px-4">
          <div className="font-semibold text-neutral-400 text-sm text-center">
            DIFFICULTY
          </div>
          <div className="flex flex-col gap-2 items-center my-2">
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
  showTags,
}: {
  info: Awaited<ReturnType<typeof getPublicProblemInfo>> & {
    status?: "attempted" | "solved"
  }
  showTags: boolean
}) {
  return (
    <Link
      href={`/problems/${info.slug}`}
      className="cursor-pointer divide-x transition-colors *:p-2 hover:bg-gray-100 flex"
    >
      <div className="w-20 font-geist-mono flex items-center justify-center">
        {info.id}
      </div>
      <div className="flex flex-col grow">
        <div className="flex items-center justify-between px-2">
          <span>{info.title}</span>
          <ProblemDifficulty difficulty={info.difficulty} />
        </div>
        {showTags && (
          <div className="flex items-center justify-between px-2">
            <div className="text-xs text-neutral-400">{info.slug}</div>
            <div className="flex gap-2 items-center">
              {info.tags.map((t) => (
                <Badge className="py-0 px-2 text-xs" key={t}>
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-10 lg:w-20 flex items-center justify-center">
        <ProblemStatus status={info.status} />
      </div>
    </Link>
  )
}

export function ProblemListSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="w-full divide-y rounded-xl border overflow-hidden border-neutral-400 flex flex-col h-fit">
        <div className="divide-x divide-neutral-300 *:p-2 flex font-semibold bg-gray-50 border-b border-b-neutral-400">
          <div className="w-20 text-center">#</div>
          <div className="grow flex justify-between items-center">
            <p className="grow">Title</p>
          </div>
          <div className="w-10 lg:w-20 text-center">Status</div>
        </div>
        <div className="divide-y">
          {Array.from({ length: 10 }).map((_, idx) => (
            <ProblemSkeleton key={idx} />
          ))}
        </div>
      </div>
      <div className="w-60 flex flex-col gap-4">
        <div className="text-center font-bold text-xl text-neutral-500">
          FILTERS
        </div>
        <Card className="py-2 px-4">
          <div className="font-semibold text-neutral-400 text-sm text-center">
            OPTIONS
          </div>
          <div className="flex items-center justify-center gap-2 my-2 flex-col">
            <div className="relative">
              <Input
                className="h-8 text-neutral-500 placeholder:text-neutral-400"
                placeholder="Search"
              />
              <PiMagnifyingGlass className="absolute top-1/2 -translate-y-1/2 right-2 text-neutral-400" />
            </div>
          </div>
        </Card>
        <Card className="py-2 px-4">
          <div className="font-semibold text-neutral-400 text-sm text-center">
            DIFFICULTY
          </div>
          <div className="flex flex-col gap-2 items-center my-2"></div>
        </Card>
        <Card className="py-2 px-4">
          <div className="font-semibold text-neutral-400 text-sm text-center">
            TAGS
          </div>
        </Card>
      </div>
    </div>
  )
}

function ProblemSkeleton() {
  return (
    <div className="cursor-pointer divide-x transition-colors *:p-2 hover:bg-gray-100 flex">
      <div className="w-20 font-geist-mono flex items-center justify-center animate-pulse">
        <div className="animate-pulse bg-neutral-100 h-6 w-8"></div>
      </div>
      <div className="flex flex-col grow">
        <div className="flex items-center justify-between px-2 animate-pulse bg-neutral-100 h-6 w-40"></div>
      </div>
      <div className="w-10 lg:w-20"></div>
    </div>
  )
}
