import { cn } from "@/lib/utils"

import { EasyTooltip } from "./ui/tooltip"

import { FaCircleCheck } from "react-icons/fa6"
import { GrInProgress } from "react-icons/gr"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { TbProgress } from "react-icons/tb"
import { TbCircleDotted } from "react-icons/tb"

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

function AlternativeProblemSolvedWithoutTooltip({
  className,
}: {
  className?: string
}) {
  return <IoIosCheckmarkCircleOutline className={cn("text-2xl", className)} />
}

function AlternativeProblemSolvedWithTooltip({
  className,
}: {
  className?: string
}) {
  return (
    <EasyTooltip tip="Solved">
      <AlternativeProblemSolvedWithoutTooltip className={className} />
    </EasyTooltip>
  )
}

function AlternativeProblemAttemptedWithoutTooltip({
  className,
}: {
  className?: string
}) {
  return <TbProgress className={cn("text-2xl", className)} />
}

function AlternativeProblemAttemptedWithTooltip({
  className,
}: {
  className?: string
}) {
  return (
    <EasyTooltip tip="Attempted">
      <AlternativeProblemAttemptedWithoutTooltip className={className} />
    </EasyTooltip>
  )
}

function AlternativeProblemNotAttempted({ className }: { className?: string }) {
  return <TbCircleDotted className={cn("text-2xl", className)} />
}

function AlternativeProblemNotAttemptedWithTooltip({
  className,
}: {
  className?: string
}) {
  return (
    <EasyTooltip tip="Not Attempted">
      <AlternativeProblemNotAttempted className={className} />
    </EasyTooltip>
  )
}

export function AlternativeProblemStatus({
  status,
  tooltip = true,
  className,
}: {
  status?: "attempted" | "solved"
  tooltip?: boolean
  className?: string
}) {
  if (tooltip) {
    if (status === "solved")
      return <AlternativeProblemSolvedWithTooltip className={className} />
    if (status === "attempted")
      return <AlternativeProblemAttemptedWithTooltip className={className} />
    return <AlternativeProblemNotAttemptedWithTooltip className={className} />
  }
  if (status === "solved")
    return <AlternativeProblemSolvedWithoutTooltip className={className} />
  if (status === "attempted")
    return <AlternativeProblemAttemptedWithoutTooltip className={className} />
  return <AlternativeProblemNotAttempted className={className} />
}
