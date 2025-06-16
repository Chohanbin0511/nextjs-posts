import Link from 'next/link'

export function NavLinks({ currentPath }: { currentPath: string }) {
  return (
    <nav>
      <Link
        className={`link${currentPath === '/posts' ? ' active' : ''}`}
        href="/posts"
      >
        Post
      </Link>
    </nav>
  )
}