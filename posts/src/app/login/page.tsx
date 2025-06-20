'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/store/auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoggedIn, isInitialized } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // 로그인 상태 체크 및 리다이렉트 처리
  useEffect(() => {
    if (isInitialized && isLoggedIn) {
      const callbackUrl = searchParams?.get('callbackUrl') || '/posts'
      console.log('Already logged in, redirecting to:', callbackUrl)
      router.push(callbackUrl)
    }
  }, [isInitialized, isLoggedIn, router, searchParams])

  // 초기화 중이면 로딩 화면 표시
  if (!isInitialized) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">로딩 중...</p>
      </div>
    )
  }

  // 로그인되어 있으면 리다이렉트 중 화면 표시
  if (isLoggedIn) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">리다이렉트 중...</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Login attempt with:', email)
      const success = await login(email, password)
      console.log('Login result:', success)
      
      if (success) {
        console.log('Login successful, redirecting immediately')
        const callbackUrl = searchParams?.get('callbackUrl') || '/posts'
        console.log('Redirecting to:', callbackUrl)
        
        // 작은 지연을 줘서 상태 업데이트가 완료되도록 함
        setTimeout(() => {
          router.push(callbackUrl)
        }, 100)
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">로그인</h1>
          <p className="login-subtitle">
            Chohbin Posts에 오신 것을 환영합니다
          </p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}
          
          <div className="login-field">
            <label htmlFor="email" className="login-label">
              이메일 주소
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
              placeholder="your@email.com"
            />
          </div>
          
          <div className="login-field">
            <label htmlFor="password" className="login-label">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              className="login-input"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <div className="login-info">
          <p className="login-info-text">
            테스트용 계정: 아무 이메일과 4자 이상 비밀번호를 입력하세요<br />
            예: test@example.com / 1234
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">로딩 중...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
} 