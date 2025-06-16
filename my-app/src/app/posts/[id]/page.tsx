'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types/post';
import { use } from 'react';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { id } = use(params);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/posts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      try {
        setIsDeleting(true);
        const response = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete post');
        }
        router.push('/posts');
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('게시글 삭제에 실패했습니다.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchPost}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>
            <Link
              href="/posts"
              className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-500 text-sm">
              작성일: {formatDate(post.createdAt)}
            </p>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/posts"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              목록으로
            </Link>
            <Link
              href={`/posts/${post.id}/edit`}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              수정
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 