'use client'

import Header from './Header'
import Footer from './Footer'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
} 