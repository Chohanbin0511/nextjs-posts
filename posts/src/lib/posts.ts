// 정적 posts 데이터 (API routes 대신 사용)
export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export const posts: Post[] = [
  {
    id: '1',
    title: '첫 번째 게시글',
    content: '이것은 첫 번째 게시글의 내용입니다.',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2', 
    title: '두 번째 게시글',
    content: '이것은 두 번째 게시글의 내용입니다.',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    title: '세 번째 게시글', 
    content: '이것은 세 번째 게시글의 내용입니다.',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPostById(id: string): Post | undefined {
  return posts.find(post => post.id === id);
}

export function createPost(title: string, content: string): Post {
  const newPost: Post = {
    id: Date.now().toString(),
    title,
    content,
    createdAt: new Date().toISOString()
  };
  posts.unshift(newPost);
  return newPost;
}

export function updatePost(id: string, title: string, content: string): Post | null {
  const postIndex = posts.findIndex(post => post.id === id);
  if (postIndex === -1) return null;
  
  posts[postIndex] = {
    ...posts[postIndex],
    title,
    content
  };
  return posts[postIndex];
}

export function deletePost(id: string): boolean {
  const postIndex = posts.findIndex(post => post.id === id);
  if (postIndex === -1) return false;
  
  posts.splice(postIndex, 1);
  return true;
} 