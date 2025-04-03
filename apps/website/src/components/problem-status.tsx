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
