import { cn } from "@/lib/utils"

import { EasyTooltip } from "./ui/tooltip"

import { FaCircleCheck } from "react-icons/fa6"
import { GrInProgress } from "react-icons/gr"

function ProblemSolvedWithTooltip() {
  return (
    <EasyTooltip tip="Solved">
      <div>
        <FaCircleCheck className="text-green-500" />
      </div>
    </EasyTooltip>
  )
}

function ProblemAttemptedWithTooltip() {
  return (
    <EasyTooltip tip="Attempted">
      <div>
        <GrInProgress className="text-yellow-500" />
      </div>
    </EasyTooltip>
  )
}

function ProblemSolvedWithoutTooltip() {
  return <FaCircleCheck className="inline text-green-500" />
}

function ProblemAttemptedWithoutTooltip() {
  return <GrInProgress className="inline text-yellow-500" />
}

export function ProblemStatus({
  status,
  tooltip = true,
}: {
  status?: "attempted" | "solved"
  tooltip?: boolean
}) {
  if (tooltip) {
    if (status === "attempted") return <ProblemAttemptedWithTooltip />
    if (status === "solved") return <ProblemSolvedWithTooltip />
  }

  if (status === "attempted") return <ProblemAttemptedWithoutTooltip />
  if (status === "solved") return <ProblemSolvedWithoutTooltip />

  return null
}

export function ProblemDifficulty({
  difficulty,
}: {
  difficulty: "easy" | "medium" | "hard"
}) {
  return (
    <span
      className={cn("text-xs lg:text-sm", {
        "text-green-400 dark:text-green-600": difficulty === "easy",
        "text-yellow-400 dark:text-yellow-600": difficulty === "medium",
        "text-red-400 dark:text-red-600": difficulty === "hard",
      })}
    >
      {difficulty}
    </span>
  )
}
