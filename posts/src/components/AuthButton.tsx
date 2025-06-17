'use client'

import { useAuth } from '@/store/auth'

export default function AuthButton() {
  const { user, isLoggedIn, logout } = useAuth()

  if (isLoggedIn && user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          안녕하세요, {user.name}님!
        </span>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <a
      href="/login"
      className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      로그인
    </a>
  )
} 