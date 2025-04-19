export function DesktopContainer({ children }: { children: React.ReactNode }) {
  return <div className="hidden h-full w-full md:block">{children}</div>
}

export function MobileContainer({ children }: { children: React.ReactNode }) {
  return <div className="block h-full w-full md:hidden">{children}</div>
}
