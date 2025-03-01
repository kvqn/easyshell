export async function ProblemBody({ slug }: { slug: string }) {
  const { default: Markdown } = (await import(
    `~/problems/${slug}/page.mdx`
  )) as { default: React.ComponentType }
  return <Markdown />
}
