'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types/post';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <p className="error-message">{error}</p>
          <button
            onClick={fetchPost}
            className="btn-retry"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="error-container">
        <div className="error-card">
          <p className="not-found-message">게시글을 찾을 수 없습니다.</p>
          <Link href="/posts" className="btn-retry">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <div className="post-detail-card">
        <div className="post-detail-header">
          <h1 className="post-title">{post.title}</h1>
          <p className="post-meta">
            작성일: {formatDate(post.createdAt)}
          </p>
        </div>

        <div className="post-content">
          <div className="post-text">{post.content}</div>
        </div>

        <div className="post-detail-actions">
          <Link href="/posts" className="btn-list">
            목록으로
          </Link>
          <Link href={`/posts/${post.id}/edit`} className="btn-edit">
            수정
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-delete"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
} 