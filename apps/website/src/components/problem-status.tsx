import { EasyTooltip } from "./ui/tooltip"

import { FaCircleCheck } from "react-icons/fa6"
import { GrInProgress } from "react-icons/gr"

function ProblemSolved() {
  return (
    <EasyTooltip tip="Solved">
      <FaCircleCheck className="text-green-500" />
    </EasyTooltip>
  )
}

function ProblemAttempted() {
  return (
    <EasyTooltip tip="Attempted">
      <GrInProgress className="text-yellow-500" />
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
  if (difficulty === "easy") {
    return <span className="text-sm text-green-400">easy</span>
  }
  if (difficulty === "medium") {
    return <span className="text-sm text-yellow-400">medium</span>
  }
  if (difficulty === "hard") {
    return <span className="text-sm text-red-400">hard</span>
  }
}
