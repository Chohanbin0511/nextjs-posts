// 🚀 현재 프로젝트에 맞는 실용적인 미들웨어
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('🔥 미들웨어 실행:', pathname)
  
  // 🔐 로그인 체크 (Zustand + 쿠키 방식)
  if (pathname.includes('/posts/new') || (pathname.includes('/posts/') && pathname.includes('/edit'))) {
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
    const userEmail = request.cookies.get('user-email')?.value
    
    if (!isLoggedIn || !userEmail) {
      console.log('🔐 로그인 필요:', pathname)
      // 로그인 페이지로 리다이렉트하면서 원래 URL 저장
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    console.log('✅ 로그인 확인됨:', userEmail)
  }
  
  // 📊 포스트 조회수 추적 (실제로 유용한 기능)
  if (pathname.match(/^\/posts\/[^\/]+$/) && !pathname.includes('/new') && !pathname.includes('/edit')) {
    console.log('📊 포스트 조회:', pathname)
    const response = NextResponse.next()
    
    // 조회수 추적을 위한 헤더 추가
    response.headers.set('x-post-view', 'true')
    response.headers.set('x-post-id', pathname.split('/').pop() || '')
    response.headers.set('x-view-timestamp', Date.now().toString())
    
    // 로그인한 사용자인지도 헤더에 추가
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
    response.headers.set('x-viewer-logged-in', isLoggedIn ? 'true' : 'false')
    
    return response
  }
  
  // 🔄 URL 리다이렉트 (/post/123 → /posts/123)
  if (pathname.startsWith('/post/')) {
    const newPath = pathname.replace('/post/', '/posts/')
    console.log('🔄 리다이렉트:', pathname, '→', newPath)
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }
  
  // ⚡ 포스트 목록 캐싱
  if (pathname === '/posts') {
    console.log('⚡ 목록 캐싱 적용')
    const response = NextResponse.next()
    response.headers.set('cache-control', 'public, max-age=60')
    
    // 로그인 상태도 헤더에 추가
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
    response.headers.set('x-user-logged-in', isLoggedIn ? 'true' : 'false')
    
    return response
  }
  
  // 🌐 기본 보안 헤더
  const response = NextResponse.next()
  response.headers.set('x-content-type-options', 'nosniff')
  
  return response
}

// 실행할 경로 지정
export const config = {
  matcher: [
    '/posts/:path*',
    '/post/:path*',
  ]
} 