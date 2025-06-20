'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/store/auth'

export function NavLinks() {
  const pathname = usePathname()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { user, isLoggedIn, logout, isInitialized } = useAuth()
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleLogout = () => {
    logout()
    handleNavigation('/') // 로그아웃 후 홈으로 이동
  }
  
  return (
    <>
      <div className="header-left">
        <h1 className="logo">Chohbin Posts</h1>
        <nav className="main-nav">
          <span 
            className={`nav-item ${pathname === '/contact' ? 'active' : ''}`}
            onClick={() => handleNavigation('/contact')}
          >
            문의하기
          </span>
          <span 
            className={`nav-item ${pathname === '/posts' || pathname?.startsWith('/posts') ? 'active' : ''}`}
            onClick={() => handleNavigation('/posts')}
          >
            게시글
          </span>
          {/* <span className="nav-item">G VOC</span>
          <span className="nav-item">채팅문의</span>
          <span className="nav-item">시스템점검</span>
          <span className="nav-item">통합 NPS <span className="new-badge">N</span></span>
          <span className="nav-item">VOC LAB <span className="new-badge">N</span></span> */}
        </nav>
      </div>
      <div className="header-right">
        {/* <div className="notifications">
          <span className="notification-icon">🔔</span>
          <span className="notification-count">2</span>
        </div>
        <div className="notifications">
          <span className="notification-icon">💬</span>
          <span className="notification-count">1</span>
        </div> */}
        <div className="user-info">
          <span className="user-name">
            {isLoggedIn && user ? user.name : '게스트'}
          </span>
          {/* <span className="toggle-switch">🌙</span> */}
        </div>
        {/* 로그인 상태에 따라 Login/Logout 버튼 표시 */}
        {isInitialized && (
          <div className="auth-section">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="auth-btn logout-btn"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => handleNavigation('/login')}
                className="auth-btn login-btn"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}