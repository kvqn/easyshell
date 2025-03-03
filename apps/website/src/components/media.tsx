export function DesktopContainer({ children }: { children: React.ReactNode }) {
  return <div className="hidden md:block">{children}</div>
}

export function MobileContainer({ children }: { children: React.ReactNode }) {
  return <div className="block md:hidden">{children}</div>
}
