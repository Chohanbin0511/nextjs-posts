import { NextResponse } from 'next/server';
import { Post, CreatePostInput } from '@/types/post';

// 데이터를 공유하기 위해 별도의 파일로 분리
export let posts: Post[] = [
  {
    id: '1',
    title: '첫 번째 게시글',
    content: '이것은 첫 번째 게시글의 내용입니다. Next.js와 TypeScript를 사용하여 만든 블로그 시스템입니다.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: '두 번째 게시글',
    content: '두 번째 게시글입니다. 여기에는 더 많은 내용이 들어갈 수 있습니다. 게시글 관리 시스템이 잘 작동하는지 확인해보세요.',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    title: '세 번째 게시글',
    content: '마지막 테스트 게시글입니다. CRUD 기능이 모두 정상적으로 작동하는지 테스트해보실 수 있습니다.',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  }
];

export async function GET() {
  try {
    console.log('GET /api/posts called, returning:', posts.length, 'posts');
    return NextResponse.json(posts, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: CreatePostInput = await request.json();
    const newPost: Post = {
      id: Date.now().toString(),
      title: body.title,
      content: body.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.push(newPost);
    console.log('POST /api/posts - created new post:', newPost.id);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 