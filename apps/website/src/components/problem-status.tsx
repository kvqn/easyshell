import { cn } from "@/lib/utils"

import { EasyTooltip } from "./ui/tooltip"

import { FaCircleCheck } from "react-icons/fa6"
import { GrInProgress } from "react-icons/gr"

function ProblemSolved() {
  return (
    <EasyTooltip tip="Solved">
      <div>
        <FaCircleCheck className="text-green-500" />
      </div>
    </EasyTooltip>
  )
}

function ProblemAttempted() {
  return (
    <EasyTooltip tip="Attempted">
      <div>
        <GrInProgress className="text-yellow-500" />
      </div>
    </EasyTooltip>
  )
}

export function ProblemStatus({ status }: { status?: "attempted" | "solved" }) {
  if (status === "attempted") {
    return <ProblemAttempted />
  }
  if (status === "solved") {
    return <ProblemSolved />
  }
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
