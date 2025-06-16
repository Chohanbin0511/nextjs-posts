import { NavLinks } from '@/app/ui/nav-links'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NavLinks currentPath="/posts" />
        <main>{children}</main>
      </body>
    </html>
  )
}