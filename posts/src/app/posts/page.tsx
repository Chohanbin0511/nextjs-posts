'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types/post';
import AuthButton from '@/components/AuthButton';

export default function PostsPage() {
  const router = useRouter();
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

  const handleView = (id: string) => {
    router.push(`/posts/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/posts/${id}/edit`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 섹션 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">게시글 목록</h1>
            <p className="text-gray-600">총 {posts.length}개의 게시글이 있습니다.</p>
          </div>
          <div className="flex items-center gap-4">
            <AuthButton />
            <Link
              href="/posts/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              새 글 작성
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl text-gray-400">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">게시글이 없습니다</h3>
            <p className="text-gray-500 mb-6">첫 번째 게시글을 작성해보세요!</p>
            <Link
              href="/posts/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              게시글 작성하기
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                      제목
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell border border-gray-300">
                      내용 미리보기
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                      작성일
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {posts.map((post, index) => (
                    <tr 
                      key={post.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                            <Link href={`/posts/${post.id}`} className="hover:underline">
                              {post.title}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell border border-gray-300">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {post.content.length > 100 ? `${post.content.substring(0, 80)}...` : post.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                        <div className="text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-300">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleView(post.id)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                          >
                            보기
                          </button>
                          <button
                            onClick={() => handleEdit(post.id)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 