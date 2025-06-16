'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/types/post';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete post');
        }
        fetchPosts();
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 통일
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
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchPosts}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">게시글 목록</h1>
          <Link
            href="/posts/new"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            새 글 작성
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">게시글이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-gray-500 text-sm">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/posts/${post.id}`}
                      className="px-3 py-1 text-blue-500 hover:text-blue-700"
                    >
                      보기
                    </Link>
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="px-3 py-1 text-green-500 hover:text-green-700"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-1 text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 