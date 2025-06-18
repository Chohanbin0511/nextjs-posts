// Zustand 로그인 상태 관리 + 쿠키 동기화
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  isInitialized: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User) => void
}

// 쿠키 동기화 함수들
const syncToCookie = (isLoggedIn: boolean, user: User | null) => {
  if (isLoggedIn && user) {
    // 미들웨어에서 확인할 수 있도록 쿠키에 저장
    Cookies.set('isLoggedIn', 'true', { expires: 7 }) // 7일간 유효
    Cookies.set('user-id', user.id, { expires: 7 })
    Cookies.set('user-email', user.email, { expires: 7 })
  } else {
    // 로그아웃 시 쿠키 삭제
    Cookies.remove('isLoggedIn')
    Cookies.remove('user-id')
    Cookies.remove('user-email')
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      isInitialized: false,

      // 로그인 함수 (임시 구현)
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          console.log('로그인 시도:', email)
          
          // 임시 로그인 로직 (실제로는 API 호출)
          if (email && password.length >= 4) {
            const user: User = {
              id: Math.random().toString(36).substr(2, 9),
              email: email,
              name: email.split('@')[0] // 이메일에서 이름 추출
            }
            
            // Zustand 상태 업데이트
            set({ user, isLoggedIn: true, isLoading: false })
            
            // 쿠키에도 동기화
            syncToCookie(true, user)
            
            console.log('로그인 성공:', user)
            return true
          } else {
            console.log('로그인 실패: 잘못된 정보')
            set({ isLoading: false })
            return false
          }
        } catch (error) {
          console.error('로그인 에러:', error)
          set({ isLoading: false })
          return false
        }
      },

      // 로그아웃 함수
      logout: () => {
        console.log('로그아웃')
        set({ user: null, isLoggedIn: false })
        
        // 쿠키에서도 제거
        syncToCookie(false, null)
      },

      // 👤 사용자 정보 설정
      setUser: (user: User) => {
        set({ user, isLoggedIn: true })
        syncToCookie(true, user)
      }
    }),
    {
      name: 'auth-store', // localStorage 키
      // 페이지 새로고침 시 쿠키와 동기화
      onRehydrateStorage: () => (state) => {
        if (state) {
          const cookieLoggedIn = Cookies.get('isLoggedIn') === 'true'
          const cookieUserId = Cookies.get('user-id')
          const cookieUserEmail = Cookies.get('user-email')
          
          // 쿠키와 localStorage 상태가 다르면 쿠키 우선
          if (cookieLoggedIn && cookieUserId && cookieUserEmail) {
            const user: User = {
              id: cookieUserId,
              email: cookieUserEmail,
              name: cookieUserEmail.split('@')[0]
            }
            state.user = user
            state.isLoggedIn = true
          } else if (!cookieLoggedIn) {
            state.user = null
            state.isLoggedIn = false
          }
          
          // 초기화 완료 표시
          state.isInitialized = true
        }
      }
    }
  )
)

// 로그인 상태 확인 훅
export const useAuth = () => {
  const { user, isLoggedIn, isLoading, isInitialized, login, logout } = useAuthStore()
  return { user, isLoggedIn, isLoading, isInitialized, login, logout }
} 