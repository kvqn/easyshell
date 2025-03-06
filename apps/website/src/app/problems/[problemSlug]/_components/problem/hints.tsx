import { getProblemHintBody, getProblemHintCount } from "@easyshell/problems"
import { MDXRemote } from "next-mdx-remote-client/rsc"

import { BackgroundHeroTexture } from "@/components/backgrounds/hero-texture"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { customComponents } from "@/mdx-components"

export function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t">
      <h2 className="mb-2 mt-6 text-xl font-bold">Hints</h2>
      {children}
    </div>
  )
}

export async function ProblemHints({ slug }: { slug: string }) {
  const hintCount = await getProblemHintCount(slug)
  if (hintCount === 0)
    return (
      <Wrapper>
        <BackgroundHeroTexture className="text-center text-neutral-400 border rounded-md py-4 heropattern-texture-neutral-200 bg-neutral-50 border-neutral-300">
          No hints for this one. Good luck!
        </BackgroundHeroTexture>
      </Wrapper>
    )
  const hints = await Promise.all(
    Array.from({ length: hintCount }).map(async (_, hint) => {
      return {
        hint: hint + 1,
        node: (
          <MDXRemote
            source={await getProblemHintBody(slug, hint + 1)}
            components={customComponents}
          />
        ),
      }
    }),
  )

  hints.sort((a, b) => a.hint - b.hint)

  return (
    <Wrapper>
      <Accordion type="single" collapsible className="space-y-4">
        {hints.map(({ node }, i) => (
          <AccordionItem
            value={`${i + 1}`}
            key={i + 1}
            className="border-top-0 rounded-lg border bg-neutral-100 shadow-sm"
          >
            <AccordionTrigger className="text-md rounded-lg border bg-white px-4 py-2 font-semibold shadow-sm hover:bg-neutral-50">{`Hint #${i + 1}`}</AccordionTrigger>
            <AccordionContent className="px-4 py-2">{node}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Wrapper>
  )
}
