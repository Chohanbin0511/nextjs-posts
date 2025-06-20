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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="posts-container">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button onClick={fetchPosts} className="retry-btn">
            다시 시도
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="posts-container">
      {/* 헤더 섹션 */}
      <div className="posts-header">
        <div className="posts-title-section">
          <h1 className="posts-title">게시글 관리</h1>
          <p className="posts-subtitle">총 {posts.length}개의 게시글이 있습니다.</p>
        </div>
        <div className="posts-actions">
          <AuthButton />
          <Link href="/posts/new" className="new-post-btn">
            ✏️ 새 글 작성
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            📝
          </div>
          <h3 className="empty-state-title">게시글이 없습니다</h3>
          <p className="empty-state-description">
            첫 번째 게시글을 작성해보세요!
          </p>
          <Link href="/posts/new" className="new-post-btn">
            새 글 작성하기
          </Link>
        </div>
      ) : (
        <div className="posts-table-container">
          <table className="posts-table">
            <thead>
              <tr>
                <th>제목</th>
                <th>내용</th>
                <th>작성일</th>
                <th style={{ textAlign: 'center' }}>작업</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/posts/${post.id}`} className="post-title-link">
                      {post.title}
                    </Link>
                  </td>
                  <td className="post-date">
                      {post.content.length > 100 
                        ? `${post.content.substring(0, 80)}...` 
                        : post.content
                      }
                  </td>
                  <td>
                    <div className="post-date">
                      {formatDate(post.createdAt)}
                    </div>
                  </td>
                  <td>
                    <div className="post-actions">
                      <button
                        onClick={() => handleView(post.id)}
                        className="action-btn view"
                      >
                        보기
                      </button>
                      <button
                        onClick={() => handleEdit(post.id)}
                        className="action-btn edit"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="action-btn delete"
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
      )}
    </div>
  );
} 