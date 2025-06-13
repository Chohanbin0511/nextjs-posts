import Link from 'next/link'
/**
 * 루트 레이아웃에 <title> 및 <meta>와 같은 <head> 태그를 수동으로 추가하지 말아야 합니다.
 * 대신 메타데이터 API를 사용하여 스트리밍 및 <head> 요소 중복 제거와 같은 고급 요구 사항을 자동으로 처리하세요.
 * 사용 가능한 메타데이터 옵션 정보 참고 URL: https://nextjs-ko.org/docs/app/api-reference/functions/generate-metadata
 */

/**
 * Next.js의 경로 간 이동하는 방법 네가지
 * 1. <Link> 컴포넌트 사용
 *  1-1.<Link>는 HTML <a> 태그를 확장하여 경로 간 사전 로드와 클라이언트 측 내비게이션을 제공하는 내장 컴포넌트입니다. Next.js에서 경로 간 이동을 위한 기본적이고 권장되는 방법입니다.
 *  1-2. 사용 방법: <Link href="/about">About</Link>
 *  1-3. API 레퍼런스 URL: https://nextjs-ko.org/docs/app/api-reference/components/link
 *  1-4. Scrolling to an id: <Link href="/dashboard#settings">Settings</Link>
 *  1-5. Disabling scroll restoration: <Link href="/dashboard" scroll={false}>Dashboard</Link>
 * 2. useRouter 훅 사용 (클라이언트 컴포넌트) : https://nextjs-ko.org/docs/app/building-your-application/rendering/client-components
 *  2-1. 사용 방법: const router = useRouter()
 *  2-2. <button type="button" onClick={() => router.push('/dashboard')}>Dashboard</button>
 * 3. redirect 함수 사용 (서버 컴포넌트) : https://nextjs-ko.org/docs/app/building-your-application/rendering/server-components
 *  3-1. 사용 방법: redirect('/dashboard')
 *  3-2. API 레퍼런스 URL: https://nextjs-ko.org/docs/app/api-reference/functions/redirect
 *  3-3. 예시
 *    redirect('/dashboard')
 *    redirect('/dashboard', RedirectType.replace)
 *    redirect('/dashboard', RedirectType.follow)
 *    redirect('/dashboard', RedirectType.error)
 *  3-4. 참고
 *    redirect는 기본적으로 307 (임시 리디렉션) 상태 코드를 반환합니다. 
 *    서버 액션에서 사용될 때는 303 (다른 페이지 보기)를 반환하며, 이는 POST 요청 결과로 성공 페이지로 리디렉션하는 데 자주 사용됩니다.
 *    redirect는 내부적으로 오류를 발생시키므로 try/catch 블록 외부에서 호출해야 합니다.
 *    redirect는 렌더링 프로세스 동안 클라이언트 컴포넌트에서 호출될 수 있지만, 이벤트 핸들러에서는 호출될 수 없습니다. 대신 useRouter 훅을 사용할 수 있습니다.
 *    redirect는 절대 URL도 허용하며 외부 링크로 리디렉션하는 데 사용할 수 있습니다.
 *    렌더링 프로세스 전에 리디렉션하려면 next.config.js 또는 미들웨어를 사용하세요.
 * 4. 네이티브 History API 사용
 *  4-1. Next.js는 네이티브 window.history.pushState(opens in a new tab) 및 window.history.replaceState(opens in a new tab) 메서드를 사용하여 페이지를 다시 로드하지 않고 브라우저의 히스토리 스택을 업데이트할 수 있습니다.
 *  4-2. pushState 및 replaceState 호출은 Next.js 라우터와 통합되어 usePathname 및 useSearchParams와 동기화할 수 있습니다.
 *  4-3. 사용 방법: window.history.pushState({}, '', '/dashboard')
 *  4-4. API 레퍼런스 URL: https://developer.mozilla.org/en-US/docs/Web/API/History_API
 *  4-5. 예시 
 *    window.history.pushState({}, '', '/dashboard')
 *    window.history.replaceState({}, '', '/dashboard')
 *    window.history.back()
 *    window.history.forward()
 */
export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}