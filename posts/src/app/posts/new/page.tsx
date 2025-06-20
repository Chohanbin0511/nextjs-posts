'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreatePostInput } from '@/types/post';

export default function NewPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreatePostInput>({
    title: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/posts');
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('게시글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="new-post-container">
      <div className="new-post-card">
        <div className="new-post-header">
          <h1>새 게시글 작성</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="new-post-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="게시글 제목을 입력하세요"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              className="form-textarea"
              placeholder="게시글 내용을 입력하세요"
            />
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-cancel"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-submit"
            >
              {isSubmitting ? '작성 중...' : '작성 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 