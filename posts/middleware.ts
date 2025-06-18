// 미들웨어 작동 테스트용 - 확실히 보이는 버전!
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 콘솔에 크게 표시 (터미널에서 확인 가능)
  console.log('미들웨어 작동중!')
  console.log('접속 경로:', pathname)
  console.log('시간:', new Date().toLocaleTimeString())
  console.log('=' .repeat(50))
  
  // 모든 페이지에 눈에 보이는 헤더 추가
  const response = NextResponse.next()
  response.headers.set('x-middleware-test', 'WORKING')
  response.headers.set('x-current-time', Date.now().toString())
  
  // /posts 페이지에서 특별한 메시지 추가
  if (pathname === '/posts') {
    console.log('포스트 목록 페이지입니다!')
    response.headers.set('x-page-type', 'posts-list')
  }
  
  // /posts/new 접속 시 알림
  if (pathname === '/posts/new') {
    console.log('새 글 작성 페이지 접속!')
    response.headers.set('x-page-type', 'new-post')
  }
  
  // 로그인 페이지에 접근할 때
  if (pathname === '/login') {
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
    
    if (isLoggedIn) {
      // 이미 로그인되어 있으면 리다이렉트
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/posts'
      const url = new URL(callbackUrl, request.url)
      return NextResponse.redirect(url)
    }
  }
  
  // 보호된 라우트에 접근할 때
  if (pathname.startsWith('/posts') && pathname !== '/posts') {
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
    
    if (!isLoggedIn) {
      // 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }
  
  return response
}

// 모든 posts 관련 경로에서 실행
export const config = {
  matcher: ['/login', '/posts/:path*']
} 