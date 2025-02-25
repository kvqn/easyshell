import { readdir } from "fs/promises"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export async function ProblemHints({ slug }: { slug: string }) {
  const files = await readdir(`./problems/${slug}/hints`)
  console.log(files)
  const hints = await Promise.all(
    files.map(async (file) => {
      const { default: Markdown } = (await import(
        `~/problems/${slug}/hints/${file}`
      )) as { default: React.ComponentType }
      return {
        file: file,
        node: <Markdown />,
      }
    }),
  )

  hints.sort((a, b) => a.file.localeCompare(b.file))

  return (
    <div className="mt-6 border-t">
      <h2 className="mb-2 mt-6 text-xl font-bold">Hints</h2>

      <Accordion type="single" collapsible className="space-y-4">
        {hints.map(({ file: _, node }, i) => (
          <AccordionItem
            value={`${i + 1}`}
            key={i + 1}
            className="border-top-0 rounded-lg border bg-neutral-100 shadow"
          >
            <AccordionTrigger className="text-md rounded-lg border bg-white px-4 py-2 font-semibold shadow hover:bg-neutral-50">{`Hint #${i + 1}`}</AccordionTrigger>
            <AccordionContent className="px-4 py-2">{node}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
