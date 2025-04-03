import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { FaCircleCheck } from "react-icons/fa6"
import { GrInProgress } from "react-icons/gr"

function ProblemSolved() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <FaCircleCheck className="text-green-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Solved</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function ProblemAttempted() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <GrInProgress className="text-yellow-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Attempted</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
