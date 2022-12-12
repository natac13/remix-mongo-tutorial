import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return <div className="h-screen w-full bg-blue-50 font-sans">{children}</div>
}
