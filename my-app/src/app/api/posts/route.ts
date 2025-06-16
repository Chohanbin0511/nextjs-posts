import { NextResponse } from 'next/server';
import { Post, CreatePostInput } from '@/types/post';

// 데이터를 공유하기 위해 별도의 파일로 분리
export let posts: Post[] = [];

export async function GET() {
  return NextResponse.json(posts);
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
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 