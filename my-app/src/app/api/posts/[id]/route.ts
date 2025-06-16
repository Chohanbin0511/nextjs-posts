import { NextResponse } from 'next/server';
import { Post, UpdatePostInput } from '@/types/post';
import { posts } from '../route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = posts.find((p) => p.id === params.id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in GET /api/posts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdatePostInput = await request.json();
    const postIndex = posts.findIndex((p) => p.id === params.id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const updatedPost: Post = {
      ...posts[postIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    posts[postIndex] = updatedPost;
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error in PUT /api/posts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postIndex = posts.findIndex((p) => p.id === params.id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    posts.splice(postIndex, 1);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/posts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 