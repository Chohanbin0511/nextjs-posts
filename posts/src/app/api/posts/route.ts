import { NextResponse } from 'next/server';
import { Post, CreatePostInput } from '@/types/post';
import { posts } from '@/lib/posts-data';

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