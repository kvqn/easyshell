import type { MDXComponents } from "mdx/types"

export const customComponents: MDXComponents = {
  h1: ({ children }) => <h1 className="mt-6 text-xl font-bold">{children}</h1>,
  p: ({ children }) => (
    <p className="text-md my-2 dark:text-neutral-400">{children}</p>
  ),
  pre: ({ children }) => (
    <div className="text-md group relative m-4">
      <pre className="overflow-x-scroll rounded-md bg-neutral-800 p-4 text-white dark:text-black [&>code]:rounded-none [&>code]:bg-neutral-800 [&>code]:p-0">
        {children}
      </pre>
    </div>
  ),
  code: ({ children, className }) => {
    const language = className?.replace("language-", "")
    return (
      <>
        {language && (
          <p className="absolute top-0 right-0 rounded-tr-md rounded-bl-md bg-neutral-600 p-1 text-xs opacity-0 group-hover:opacity-100 dark:text-white">
            {language}
          </p>
        )}
        <code className="rounded-md bg-neutral-200 p-1 text-sm dark:bg-neutral-800 dark:text-neutral-200">
          {children}
        </code>
      </>
    )
  },
  ol: ({ children }) => (
    <ol className="text-md my-2 ml-4 list-outside list-decimal">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="my-1 dark:text-neutral-400">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-4 border-neutral-500 bg-neutral-100 p-1 pl-2 text-sm dark:bg-neutral-800">
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
