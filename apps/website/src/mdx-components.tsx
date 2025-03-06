import type { MDXComponents } from "mdx/types"

export const customComponents: MDXComponents = {
  h1: ({ children }) => <h1 className="mt-6 text-xl font-bold">{children}</h1>,
  p: ({ children }) => <p className="my-2">{children}</p>,
  pre: ({ children }) => (
    <div className="group relative m-4">
      <pre className="rounded-md bg-neutral-800 p-4 text-white [&>code]:rounded-none [&>code]:bg-neutral-800 [&>code]:p-0 overflow-x-scroll">
        {children}
      </pre>
    </div>
  ),
  code: ({ children, className }) => {
    const language = className?.replace("language-", "")
    return (
      <>
        {language && (
          <p className="absolute right-0 top-0 rounded-bl-md bg-neutral-600 p-1 text-sm opacity-0 group-hover:opacity-100 rounded-tr-md">
            {language}
          </p>
        )}
        <code className="rounded-md bg-neutral-200 p-1">{children}</code>
      </>
    )
  },
  ol: ({ children }) => (
    <ol className="my-2 list-inside list-decimal">{children}</ol>
  ),
  li: ({ children }) => <li className="my-1">{children}</li>,
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...customComponents,
    ...components,
  }
}
