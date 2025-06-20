import { NextResponse } from 'next/server';
import { Post, UpdatePostInput } from '@/types/post';
import { posts } from '../route';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = posts.find(p => p.id === id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    console.log('GET /api/posts/[id] - found post:', post.id);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in GET /api/posts/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdatePostInput = await request.json();
    const postIndex = posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    posts[postIndex] = {
      ...posts[postIndex],
      title: body.title || posts[postIndex].title,
      content: body.content || posts[postIndex].content,
      updatedAt: new Date().toISOString(),
    };

    console.log('PUT /api/posts/[id] - updated post:', posts[postIndex].id);
    return NextResponse.json(posts[postIndex]);
  } catch (error) {
    console.error('Error in PUT /api/posts/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postIndex = posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const deletedPost = posts.splice(postIndex, 1)[0];
    console.log('DELETE /api/posts/[id] - deleted post:', deletedPost.id);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/posts/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
} 