import Link from "next/link"

import { getProblemInfo } from "@/server/actions/get-problem-info"
import { getProblems } from "@/server/utils/problem"

export const metadata = {
  title: "easyshell - browse",
}

export default async function Page() {
  const problems = (
    await Promise.all(
      (await getProblems()).map(async (problem) => {
        const info = await getProblemInfo(problem)
        return info
      }),
    )
  ).sort((a, b) => a.id - b.id)

  return (
    <table className="w-full table-auto divide-y rounded-xl border">
      <thead>
        <tr className="divide-x *:p-2">
          <th>#</th>
          <th>Title</th>
          <th>Solved</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {problems.map((problem) => (
          <Problem key={problem.id} info={problem} />
        ))}
      </tbody>
    </table>
  )
}

async function Problem({
  info,
}: {
  info: Awaited<ReturnType<typeof getProblemInfo>>
}) {
  return (
    <Link
      href={`/problems/${info.slug}`}
      className="table-row cursor-pointer divide-x transition-colors *:p-2 hover:bg-gray-100"
    >
      <td className="text-center">{info.id}</td>
      <td>{info.slug}</td>
      <td>No</td>
    </Link>
  )
}
