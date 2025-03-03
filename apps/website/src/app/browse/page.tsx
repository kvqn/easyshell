import { getProblems, getPublicProblemInfo } from "@easyshell/problems"
import Link from "next/link"

export const metadata = {
  title: "easyshell - browse",
}

export default async function Page() {
  const problems = (
    await Promise.all(
      (await getProblems()).map(async (problem) => {
        const info = await getPublicProblemInfo(problem)
        return info
      }),
    )
  ).sort((a, b) => a.id - b.id)

  return (
    <div className="w-full divide-y rounded-xl border overflow-hidden border-neutral-400">
      <div className="divide-x divide-neutral-300 *:p-2 flex font-semibold bg-gray-200 border-b border-b-neutral-400">
        <div className="w-20 text-center">#</div>
        <div className="grow">Title</div>
        <div className="w-20 lg:w-40">Solved</div>
      </div>
      <div className="divide-y">
        {problems.map((problem) => (
          <Problem key={problem.id} info={problem} />
        ))}
      </div>
    </div>
  )
}

async function Problem({
  info,
}: {
  info: Awaited<ReturnType<typeof getPublicProblemInfo>>
}) {
  return (
    <Link
      href={`/problems/${info.slug}`}
      className="cursor-pointer divide-x transition-colors *:p-2 hover:bg-gray-100 flex"
    >
      <div className="w-20 text-center">{info.id}</div>
      <div className="grow">{info.slug}</div>
      <div className="w-20 lg:w-40">No</div>
    </Link>
  )
}
