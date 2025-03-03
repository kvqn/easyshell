export default function Page() {
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
        {Array.from({ length: 10 }).map((_, i) => (
          <tr key={i} className="h-8 divide-x *:p-2">
            <td>
              <p className="h-4 animate-pulse rounded-md bg-gray-200" />
            </td>
            <td>
              <p className="h-4 animate-pulse rounded-md bg-gray-200" />
            </td>
            <td>
              <p className="h-4 animate-pulse rounded-md bg-gray-200" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
