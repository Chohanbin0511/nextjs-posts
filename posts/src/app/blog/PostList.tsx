import Link from 'next/link'

export default function PostList({ posts }: { posts: { id: string; slug: string; title: string }[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
} 