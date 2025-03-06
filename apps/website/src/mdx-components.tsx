import type { MDXComponents } from "mdx/types"

export const customComponents: MDXComponents = {
  h1: ({ children }) => <h1 className="mt-6 text-xl font-bold">{children}</h1>,
  p: ({ children }) => <p className="my-2 text-md">{children}</p>,
  pre: ({ children }) => (
    <div className="group relative m-4 text-md">
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
          <p className="absolute right-0 top-0 rounded-bl-md bg-neutral-600 p-1 text-xs opacity-0 group-hover:opacity-100 rounded-tr-md">
            {language}
          </p>
        )}
        <code className="rounded-md bg-neutral-200 p-1 text-sm">
          {children}
        </code>
      </>
    )
  },
  ol: ({ children }) => (
    <ol className="ml-4 my-2 list-decimal list-outside text-md">{children}</ol>
  ),
  li: ({ children }) => <li className="my-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-neutral-400 pl-2 my-2 bg-neutral-100 p-1 text-sm">
      {children}
    </blockquote>
  ),
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...customComponents,
    ...components,
  }
}
