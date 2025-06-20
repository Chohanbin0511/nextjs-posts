'use client'

import { useAuth } from '@/store/auth'

export default function AuthButton() {
  const { user, isLoggedIn } = useAuth()

  if (isLoggedIn && user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          안녕하세요, {user.name}님!
        </span>
      </div>
    )
  }

  return null
} 