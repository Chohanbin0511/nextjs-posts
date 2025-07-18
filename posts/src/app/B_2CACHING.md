# Caching in Next.js
Next.js는 렌더링 작업과 데이터 요청을 캐싱하여 애플리케이션의 성능을 향상시키고 비용을 절감합니다. 이 페이지에서는 Next.js의 캐싱 메커니즘, 이를 구성하는 데 사용할 수 있는 API, 그리고 이들이 상호 작용하는 방식을 심도 있게 다룹니다.

 * 알아두면 좋은 정보 
  이 페이지는 Next.js의 내부 작동 방식을 이해하는 데 도움이 되지만, Next.js를 생산적으로 사용하는 데 필수적인 지식은 아닙니다. 대부분의 Next.js 캐싱 휴리스틱은 API 사용에 의해 결정되며, 최소한의 구성으로도 최상의 성능을 발휘하도록 기본값이 설정되어 있습니다.

## Overview
다양한 캐싱 메커니즘과 그 목적에 대한 고수준 개요

| Mechanism | What | Where | Purpose | Duration |
|---|---|---|---|---|
| Request Memoization | 함수의 반환 값 | Server | React Component 트리에서 데이터를 재사용 | 요청 라이프사이클 동안 |
| Data Cache | 데이터 | Server | 사용자 요청 및 배포 간 데이터 저장 | 지속적 (재검증 가능) |
| Full Route Cache | HTML 및 RSC 페이로드 | Server | 렌더링 비용 절감 및 성능 향상 | 지속적 (재검증 가능) |
| Router Cache | RSC 페이로드 | Client | 네비게이션 시 서버 요청 감소 | 사용자 세션 또는 시간 기반 |

 기본적으로 Next.js는 성능을 향상시키고 비용을 절감하기 위해 가능한 한 많이 캐싱합니다. 이는 경로가 정적으로 렌더링되고 데이터 요청이 캐싱됨을 의미하며, 이를 선택 해제하지 않는 한 그렇습니다. 아래 다이어그램은 기본 캐싱 동작을 보여줍니다: 빌드 시와 정적 경로가 처음 방문될 때의 동작입니다

## Request Memoization
Next.js는 동일한 URL과 옵션을 가진 요청을 자동으로 메모이제이션하도록 fetch API를 확장합니다. 이는 React 컴포넌트 트리의 여러 곳에서 동일한 데이터를 가져오기 위한 fetch 함수를 호출할 때 한 번만 실행된다는 것을 의미합니다. 
예를 들어, 경로 전체에서 동일한 데이터를 사용해야 하는 경우(예: Layout, Page 및 여러 컴포넌트에서), 트리 상단에서 데이터를 가져와 컴포넌트 간에 props를 전달할 필요가 없습니다. 대신, 데이터를 필요로 하는 컴포넌트에서 데이터를 가져와 네트워크를 통해 데이터에 대해 여러 요청을 하는 성능 문제를 걱정할 필요 없이 데이터를 가져올 수 있습니다.

```javascript
async function getItem() {
  // `fetch` 함수는 자동으로 메모이제이션되고 결과는
  // 캐싱됩니다.
  const res = await fetch('https://.../item/1')
  return res.json()
}

// 이 함수는 두 번 호출되지만 처음에는 한 번만 실행됩니다.
const item = await getItem() // cache MISS

// 두 번째 호출은 경로 어디에서든 발생할 수 있습니다.
const item = await getItem() // cache HIT
```

### Request Memoization 작동 방식
 - 경로를 렌더링하는 동안 특정 요청이 처음 호출되면 해당 결과가 메모리에 없으므로 캐시 MISS 가 됩니다.
 - 따라서 함수가 실행되고 데이터가 외부 소스에서 가져와지며, 결과가 메모리에 저장됩니다.
 - 동일한 렌더링 패스에서 요청의 후속 함수 호출은 캐시 HIT이 되며, 함수 실행 없이 메모리에서 데이터를 반환합니다.
 - 경로 렌더링이 완료되고 렌더링 패스가 완료되면 메모리가 "리셋"되고 모든 요청 메모이제이션 항목이 지워집니다.

 * 알아두면 좋은 정보
  - 요청 메모이제이션은 Next.js 기능이 아니라 React 기능입니다. 이는 다른 캐싱 메커니즘과의 상호 작용을 보여주기 위해 여기에 포함되었습니다.
  - 메모이제이션은 fetch 요청의 GET 메서드에만 적용됩니다.
  - 메모이제이션은 React 컴포넌트 트리에만 적용되므로,
    - generateMetadata, generateStaticParams, Layouts, Pages 및 기타 Server Components의 fetch 요청에 적용됩니다.
    - React 컴포넌트 트리의 일부가 아닌 Route Handlers의 fetch 요청에는 적용되지 않습니다.
  - fetch가 적합하지 않은 경우(예: 일부 데이터베이스 클라이언트, CMS 클라이언트 또는 GraphQL 클랑언트), React Cache 함수를 사용하여 함수를 메모이제이션할 수 있습니다.

### Duration
캐시는 서버 요청의 수명 동안 지속되며 React 컴포넌트 트리의 렌더링이 완료될 때까지 유지됩니다.

### Revalidating
메모이제이션은 서버 요청 간에 공유되지 않으며 렌더링 중에만 적요되므로 이를 재검증할 필요가 없습니다.

### Opting out
메모이제이션은 fetch 요청의 GET 메서드에만 적용되며, POST 및 DELETE와 같은 다른 메서드는 메모이제이션 되지 않습니다.
이 기본 동작은 React 최적화이며 이를 선택 해제하는 것은 권장하지 않습니다.

개별 요청을 관리하려면 AbortController의 signal 속성을 사용할 수 있습니다. 그러나 이는 메모이제이션에서 요청을 선택 해제하는 것이 아니라, 비행 중인 요청을 중단하는 것입니다.

```javascript
const { signal } = new AbortController()
fetch(url, { signal })
```

## Data Cache
Next.js에는 서버 요청과 배포 간에 데이터 패치를 지속적으로 유지하는 내장 데이터 캐시가 있습니다. 이는 Next.js가 네이티브 fetch API를 확장하여 서버에서 각 요청이 자체 지속적 캐싱 의미론을 설정할 수 있도록 하기 때문에 가능합니다.
 * 알아두면 좋은 정보: 브라우저에서 fetch의 cache 옵션은 요청이 브라우저의 HTTP 캐시와 상호 작용하는 방식을 나타내지만, Next.js에서는 cache 옵션이 서버 측 요청이 서버의 데이터 캐시와 상호 작용하는 방식을 나타냅니다.
기본적으로 fetch를 사용하는 데이터 요청은 캐싱되지 않습니다. fetch의 cache 및 next.revalidate 옵션을 사용하여 캐싱 동작을 구성할 수 있습니다.
 
 - 'force-cache' 옵션이 있는 fetch 요청이 렌더링 중 처음 호출되면 Next.js는 데이터 캐시에서 캐시된 응답을 확인합니다.
 - 캐시된 응답이 발견되면 즉시 반환되고 메모이제이션됩니다.
 - 캐시된 응답이 발견되지 않으면 요청이 데이터 소스로 전송되고, 결과가 데이터 캐시에 저장되며 메모이제이션됩니다.
 - 캐싱되지 않은 데이터의 경우(예: 정의된 cache 옵션이 없거나 { cache: 'no-store' }를 사용하는 경우) 결과는 항상 데이터 소스에서 가져오며 메모이제이션됩니다.
 - 데이터가 캐싱되었는지 여부와 상관없이 요청은 항상 메모이제이션되어 React 렌더링 패스 동안 동일한 데이터에 대해 중복 요청을 하지 않습니다.

 * Data Cache와 Request Memoization의 차이점
  두 캐싱 메커니즘 모두 캐시된 데이터를 재사용하여 성능을 향상시키지만, Data Cache는 들어오는 요청과 배포 간에 지속되는 반면 메모이제이션은 요청의 수명 동안만 지속됩니다.
  메모이제이션을 통해 렌더링 서버에서 데이터 캐시 서버(예: CDN 또는 Edge Network)나 데이터 소스(예: 데이터 베이스 또는 CMS)로의 네트워크 경계를 넘어야 하는 중복 요청 수를 줄입니다. Data Cache를 통해 원본 데이터 소스로의 요청 수를 줄입니다.

### Duration
Data Cache는 들어오는 요청과 배포 간에 지속되며 재검증하거나 선택 해제하지 않는 한 유지됩니다.

## Revalidating
캐시된 데이터는 두 가지 방법으로 재검증할 수 있습니다.
 - 시간 기반 재검증(Time-based Revalidation): 일정 시간이 경과한 후 새 요청이 있을 때 데이터를 재검증합니다. 이는 데이터가 자주 변경되지 않고 신선도가 그리 중요하지 않은 경우에 유용합니다.
 - 온디맨드 재검증(On-demand Revalidation): 이벤트(예:폼 제출)에 따라 데이터를 재검증합니다. 온디맨드 재검증은 태그 기반 또는 경로 기반 접근 방식을 사용하여 데이터를 한 번에 재검증할 수 있습니다. 이는 헤드리스 CMS의 콘텐츠가 업데이트될 때 가능한 빨리 최신 데이터를 표시하고 싶은 경우에 유용합니다.

### Time-based Revalidation
정해진 시간 간격으로 데이터를 재검증하려면 fetch의 next.revalidate 옵션을 사용하여 리소스의 캐시 수명을 초 단위로 설정할 수 있습니다.

```javascript
// 최대 한 시간마다 재검증
fetch('https://...', { next: { revalidate: 3600 } })
```
또한, Route Segment Config options을 사용하여 세그먼트 내의 모든 fetch 요청을 구성하거나 fetch를 사용할 수 없는 경우에도 구성할 수 있습니다.

### Time-based Revalidation 작동 방식
 - revalidate가 있는 fetch 요청이 처음 호출되면 데이터가 외부 데이터 소스에서 가져와지고 Data Cache에 저장됩니다.
 - 지정된 시간 프레임(예: 60초) 내에 호출되는 모든 요청은 캐시된 데이터를 반환합니다.
 - 시간 프레임이 지난 후, 다음 요청은 여전히 캐시된(이제는 오래된) 데이터를 반환합니다.
    - Next.js는 백그라운드에서 데이터 재검증을 트리거합니다.
    - 데이터가 성공적으로 가져와지면 Next.js는 최신 데이터로 Data Cache를 업데이트합니다.
    - 백그라운드 재검증이 실패하면 이전 데이터가 변경되지 않고 유지됩니다.
이는 stale-while-revalidate(opens in a new tab) 동작과 유사합니다.

### On-demand Revalidation
데이터 경로(revalidatePath) 또는 캐시 태그(revalidateTag)에 따라 온디맨드로 재검증할 수 있습니다.

 - 첫 번째 fetch 요청이 호출되면 데이터가 외부 데이터 소스에서 가져와져 Data Cache에 저장됩니다.
 - 온디맨드 재검증이 트리거되면 적절한 캐시 항목이 캐시에서 제거됩니다.
   - 이는 재검증 기간 동안 최신 데이터가 가져와질 때까지 캐시에 오래된 데이터를 유지하는 시간 기반 재검증과 다릅니다.
 - 다음 요청이 있을 때 다시 캐시 MISS가 되며 데이터가 외부 데이터 소스에서 가져와져 Data Cache에 저장됩니다.


### Opting out
기본적으로 fetch 요청은 캐싱되지 않으므로 캐싱을 선택 해제할 필요가 없습니다. 이는 fetch가 호출될 때마다 데이터가 데이터 소스에서 가져와진다는 것을 의미합니다.

 * 참고
 데이터 캐시는 현재 Layout, Pages 및 Route Handlers에서만 사용할 수 있으며, Middleware에서는 사용할 수 없습니다. Middleware 내부에서 수행된 모든 fetch는 기본적으로 캐시되지 않습니다.

 * Vercel Data Cache
 Next.js 애플리케이션이 Vercel에 배포된 경우, Vercel의 특정 기능을 더 잘 이해하려면 Vercel Data Cache(opens in a new tab) 문서를 읽는 것이 좋습니다.

 ## Full Route Cache
  * 관련 용어
  Automatic Static Optimization, Static Site Generation 또는 Static Rendering이라는 용어가 애플리케이션의 경로를 빌드 시 렌더링하고 캐싱하는 과정을 지칭하는 데 사용될 수 있습니다.
Next.js는 빌드 시 자동으로 경로를 렌더링하고 캐싱합니다. 이는 요청마다 서버에서 렌더링하는 대신 캐시된 경로를 제공할 수 있는 최적화로, 페이지 로드를 더 빠르게 만듭니다.
Full Route Cache의 작동 방식을 이해하려면 React가 렌더링을 처리하는 방식과 Next.js가 결과를 캐시하는 방식을 살펴보는 것이 도움이 됩니다.

### 1. React Rendering on the Server
서버에서 Next.js는 React의 API를 사용하여 렌더링을 조율합니다. 렌더링 작업은 개별 경로 세그먼트와 Suspense 경계를 기준으로 청크로 나눕니다.
 
각 청크는 두 단계로 렌더링 됩니다.
 1. React는 서버 컴포넌트를 스트리밍에 최적화된 특별한 데이터 형식인 React Server Component Payload로 렌더링 합니다.
 2. Next.js는 React Server Component Payload와 클라이언트 자바스크립트 명령을 사용하여 서버에서 HTML을 렌더링합니다.

이는 모든 것이 렌더링될 때까지 기다릴 필요 없이 작업이 완료됨에 따라 응답을 캐시하거나 전송할 수 있음을 의미합니다.
 * React Server Component Payload란 무엇인가요?
    React Server Component Payload는 렌더링된 React Server Components 트리의 압축된 이진 표현입니다. 이는 클라이언트의 React가 브라우저의 DOM을 업데이트하는 데 사용됩니다.
    React Server Component Payload는 다음을 포함합니다.

    - 서버 컴포넌트의 렌더링 결과
    - 클라이언트 컴포넌트가 렌더링되어야 할 위치에 대한 플레이스홀더와 해당 자바스크립트 파일에 대한 참조
    - 서버 컴포넌트에서 클라이언트 컴포넌트로 전달된 모든 props

### 2. Next.js Caching on the Server (Full Route Cache)
Next.js의 기본 동작은 경로의 렌더링 결과(React Server Component Payload와 HTML)를 서버에 캐시하는 것입니다. 이는 빌드 시 정적으로 렌더링된 경로나 재검증 중에 적용됩니다.

### 3. React Hydration and Reconciliation on the Client
요청 시 클라이언트에서
 1. HTML은 클라이언트 및 서버 컴포넌트의 빠른 비상호작용 초기 미리보기를 즉시 보여주는 데 사용됩니다.
 2. React Server Components Payload는 클라이언트 및 렌더링된 서버 컴포넌트 트리를 일치시키고 DOM을 업데이트하는 데 사용됩니다.
 3. 자바스크립트 명령은 클라이언트 컴포넌트를 hydrate하여 애플리케이션을 상호작용 가능하게 만듭니다.

### 4. Next.js Caching on the Client (Router Cache) 
React Server Component Payload는 클라이언트 측 Router Cache에 저장됩니다. 이는 개별 경로 세그먼트로 분할된 별도의 인메모리 캐시입니다. 이 Router Cache는 이전에 방문한 경로를 저장하고 미래의 경로를 프리페치하여 탐색경험을 향상시키는 데 사용됩니다.

### 5. Subsequent Navigations
후속 탐색 또는 프리페치 중에 Next.js는 React Server Components Payload가 Router Cache에 저장되어 있는지 확인합니다. 그렇다면 서버에 새 요청을 보내는 것을 건너뜁니다.
경로 세그먼트가 캐시에 없으면 Next.js는 서버에서 React Server Components Payload를 가져와 클라이언트의 Router Cache를 채웁니다.

### Static and Dynamic Rendering
경로가 빌드 시 캐시되는지 여부는 정적으로 렌더링되는지 동적으로 렌더링되는지에 따라 다릅니다. 정적 경로는 기본적으로 캐시되지만, 동적 경로는 요청 시 렌더링되며 캐시되지 않습니다.

### Duration
기본적으로 Full Route Cache는 지속적입니다. 이는 렌더링 출력이 사용자 요청 간에 캐시됨을 의미합니다.

### Invalidation
Full Route Cache를 무효화하는 방법은 두 가지가 있습니다:

 - 데이터 재검증: Data Cache를 재검증하면 서버에서 컴포넌트를 다시 렌더링하고 새 렌더링 출력을 캐시하여 Router Cache를 무효화합니다.
 - 재배포: 배포 간에 지속되는 Data Cache와 달리 Full Route Cache는 새 배포 시 지워집니다.

### Opting out
Full Route Cache를 옵트아웃하거나, 즉 모든 들어오는 요청에 대해 동적으로 컴포넌트를 렌더링하려면 다음과 같은 방법을 사용할 수 있습니다:

 - Dynamic Function 사용: 이 방법은 Full Route Cache에서 경로를 옵트 아웃하고 요청 시 동적으로 렌더링합니다. Data Cache는 여전히 사용할 수 있습니다.
 - dynamic = 'force-dynamic' 또는 revalidate = 0 경로 세그먼트 구성 옵션 사용: 이 방법은 Full Route Cache와 Data Cache를 건너뜁니다. 즉, 들어오는 모든 요청에 대해 컴포넌트가 렌더링되고 데이터가 가져와집니다. Router Cache는 클라이언트 측 캐시로 계속 적용됩니다.
 - Data Cache 옵트아웃: 경로에 캐시되지 않는 fetch 요청이 있는 경우, 이는 경로를 Full Route Cache에서 옵트아웃합니다. 특정 fetch 요청에 대한 데이터는 들어오는 모든 요청마다 가져와집니다. 캐싱에서 옵트아웃하지 않은 다른 fetch 요청은 여전히 Data Cache에 캐시됩니다. 이를 통해 캐시된 데이터와 캐시되지 않은 데이터의 혼합 사용이 가능합니다.


## Client-side Router Cache
Next.js는 레이아웃, 로딩 상태 및 페이지로 나뉜 경로 세그먼트의 RSC 페이로드를 저장하는 인메모리 클라이언트 측 라우터 캐시를 가지고 있습니다.
사용자가 경로 간에 탐색할 때, Next.js는 방문한 경로 세그먼트를 캐시하고 사용자가 탐색할 가능성이 있는 경로를 prefetch합니다. 이는 즉시 뒤로/앞으로 탐색을 가능하게 하고, 탐색 간 전체 페이지 리로드를 없애며, React 상태 및 브라우저 상태를 유지합니다.

Router Cache를 사용하면
 - 레이아웃은 캐시되고 탐색 시 재사용됩니다.
 - 로딩 상태는 캐시되고 탐색 시 재사용 됩니다.
 - 페이지는 기본적으로 캐시되지 않지만, 브라우저의 뒤로 및 앞으로 탐색 중에는 재사용 됩니다. 페이지 세그먼트의 캐시를 활성화하려면 실험적 staleTimes 컴포넌트 옵션을 사용할 수 있습니다.

### Duration
캐시는 브라우저의 임시 메모리에 저장됩니다. 두 가지 요소가 라우터 캐시의 지속 시간을 결정합니다

 - 세션: 캐시는 탐색 간에 지속됩니다. 그러나 페이지를 새로 고침하면 지워집니다.
 - 자동 무효화 기간: 레이아웃 및 로딩 상태의 캐시는 특정 시간이 지나면 자동으로 무효화됩니다. 기간은 리소스가 prefetched된 방법에 따라 다릅니다.
   - 기본 프리페칭(prefetch={null} 또는 미지정): 0초
   - 전체 프리페칭(prefetch={true} 또는 router.prefetch): 5분

페이지 새로 고침은 모든 캐시된 세그먼트를 지우지만, 자동 무효화 기간은 프리페치된 시점부터 개별 세그먼트에만 영향을 미칩니다.
 - 알아두면 좋은 점: 실험적 staleTimes  컴포넌트 옵션을 사용하여 세그먼트의 캐시를 활성화할 수 있습니다.

### Invalidation
Router Cache를 무효화하는 방법 2가지
 - server action에서
   - 경로별로 데이터를 온디맨드로 재검증하여(revalidatePath) 또는 캐시 태그로(revalidateTag) 무효화
   - cookies.set 또는 cookies.delete를 사용하면 쿠키를 사용하는 경로가 오래되지 않도록 Router Cache를 무효화 합니다.(예:Auth)
 - router.refresh를 호출하면 Router Cache를 무효화하고 현재 경로에 대해 서버에 새 요청을 보냅니다.

### Opting out
 - Next.js 15부터 페이지 세그먼트는 기본적으로 옵트아웃 됩니다.
  * 알아두면 좋은 점: <Link> 컴포넌트의 prefetch prop을 false로 설정하여 prefetching을 옵트아웃할 수도 있습니다.

## Cache Interactions
다양한 캐싱 메커니즘을 구성할 때, 이들이 서로 어떻게 상호작용하는지 이해하는 것이 중요합니다

### Data Cache와 Full Route Cache
 - Data Cache를 재검증하거나 옵트아웃하면 Full Route Cache가 무효화됩니다. 이는 렌더링 출력이 데이터에 의존하기 때문입니다.
 - Full Route Cache를 무효화하거나 옵트아웃해도 Data Cache에는 영향을 미치지 않습니다. 캐시된 데이터와 캐시되지 않은 데이터를 모두 포함하는 경로를 동적으로 렌더링할 수 있습니다. 이는 페이지 대부분이 캐시된 데이터를 사용하지만 일부 컴포넌트는 요청 시 가져와야 하는 데이터를 사용하는 경우 유용합니다. 모든 데이터를 다시 가져와야 하는 성능 문제 없이 동적으로 렌더링할 수 있습니다.

### Data Cache와 Client-side Router Cache
 - Data Cache와 Router Cache를 즉시 무효화하려면 서버 액셔에서 revalidatePath 또는 revalidateTag를 사용할 수 있습니다.
 - Route Handler에서 Data Cache를 재검증해도 Router Cache는 즉시 무효화되지 않습니다. Route Handler는 특정 경로에 연결되지 않기 때문입니다.
 즉, Router Cache는 하드 리프레시 또는 자동 무효화 기간이 경과할 때까지 이전 페이로드를 계속 제공합니다.

## APIs
다음 표는 다양한 Next.js API가 캐싱에 미치는 영향을 개요로 보여줍니다.

| API | Router Cache | Full Route Cache | Data Cache | React Cache |
|---|---|---|---|---|
| `<Link prefetch>` | Cache | | | |
| `router.prefetch` | Cache | | | |
| `router.refresh` | Revalidate | | | |
| `fetch` | | | Cache | Cache |
| `fetch options.cache` | | | Cache or Opt out | |
| `fetch options.next.revalidate` | | Revalidate | Revalidate | |
| `fetch options.next.tags` | | Cache | Cache | |
| `revalidateTag` | Revalidate (Server Action) | Revalidate | Revalidate | |
| `revalidatePath` | Revalidate (Server Action) | Revalidate | Revalidate | |
| `const revalidate` | | Revalidate or Opt out | Revalidate or Opt out | |
| `const dynamic` | | Cache or Opt out | Cache or Opt out | |
| `cookies` | Revalidate (Server Action) | Opt out | | |
| `headers, searchParams` | | Opt out | | |
| `generateStaticParams` | | Cache | | |
| `React.cache` | | | | Cache |
| `unstable_cache` | | | Cache | |	

### <Link>
 기본적으로 <Link> 컴포넌트는 Full Route Cache에서 경로를 자동으로 프리페치하고 React Server Component Payload를 Router Cache에 추가합니다.
 프리페칭을 비활성화하려면 prefetch 속성을 false로 설정할 수 있습니다. 그러나 이것은 캐시를 영구적으로 건너뛰지 않으며, 사용자가 경로를 방문하면 경로 세그먼트가 여전히 클라이언트 측에 캐시됩니다.

### router.prefetch
useRouter 훅의 prefetch 옵션을 사용하여 경로를 수동으로 프리페치할 수 있습니다. 이는 React Server Component Payload를 Router Cache에 추가합니다.

### router.refresh
useRouter 훅의 refresh 옵션을 사용하여 경로를 수동으로 새로 고칠 수 있습니다. 이는 Router Cache를 완전히 지우고 현재 경로에 대해 서버에 새 요청을 보냅니다. refresh는 Data Cache나 Full Route Cache에는 영향을 미치지 않습니다.

렌더링된 결과는 React 상태와 브라우저 상태를 유지하면서 클라이언트에서 일치됩니다.

### fetch
fetch에서 반환된 데이터는 Data Cache에 자동으로 캐시되지 않습니다.

```javascript
// 기본적으로 캐시됨. `no-store`는 기본 옵션이므로 생략할 수 있습니다.
fetch(`https://...`, { cache: 'no-store' })
```

렌더링 출력이 데이터에 의존하기 때문에, cache: 'no-store'를 사용하면 fetch 요청이 사용된 경로에 대해 Full Route Cache도 건너뜁니다.
즉, 경로는 모든 요청 시 동적으로 렌더링되지만, 동일한 경로에 다른 캐시된 데이터 요청이 여전히 있을 수 있습니다.

### fetch options.cache
cache 옵션을 force-cache로 설정하여 개별 fetch 요청을 캐시에 옵트인할 수 있습니다.

```javascript
// 캐시에서 옵트아웃
fetch(`https://...`, { cache: 'force-cache' })
```

### fetch options.next.revalidate
fetch의 next.revalidate 옵션을 사용하여 개별 fetch 요청의 재검증 기간(초)을 설정할 수 있습니다. 이는 Data Cache를 재검증하며, 이는 다시 Full Route Cache를 재검증합니다.
새로운 데이터가 가져와지고, 컴포넌트가 서버에서 다시 렌더링됩니다.

```javascript
// 최대 1시간 후에 재검증
fetch(`https://...`, { next: { revalidate: 3600 } })
```

### fetch options.next.tags and revalidateTag
Next.js는 세밀한 데이터 캐싱 및 재검증을 위한 캐싱 태깅 시스템을 가지고 있습니다.
    1. fetch 또는 unstable cache를 사용할 때 하나 이상의 태그로 캐시 항목을 태그할 수 있는 옵션이 있습니다.
    2. 그런 다음 revalidateTag를 호출하여 해당 태그와 연결된 캐시 항목을 제거할 수 있습니다.
예를 들어, 데이터를 가져올 때 태그를 설정할 수 있습니다.

```javascript
// 태그로 데이터 캐시
fetch(`https://...`, { next: { tags: ['a', 'b', 'c'] } })
```
그런 다음, 태그와 함께 revalidateTag를 호출하여 캐시 항목을 제거할 수 있습니다.

```javascript
// 특정 태그가 있는 항목을 재검증
revalidateTag('a')
```
revalidateTag를 사용할 수 있는 두 가지 장소가 있으며, 달성하려는 목표에 따라 다릅니다.

1. Route Handlers - 서드 파티 이벤트(예:웹훅)에 응답하여 데이터를 재검증합니다. 이는 특정 경로에 연결되지 않기 때문에 Router Cache를 즉시 무효화하지 않습니다.
2. Server Actions - 사용자 작업(예:폼 제출) 후 데이터를 재검증합니다. 이는 관련 경로에 대한 Router Cache를 무효화합니다.

### revalidatePath

revalidatePath를 사용하면 특정 경로 아래의 데이터 및 경로 세그먼트를 단일 작업으로 수동 재검증할 수 있습니다. revalidatePath 메서드를 호출하면 Data Cache가 재검증되고, 이는 다시 Full Route Cache를 무효화합니다.

```javascript
revalidatePath('/')
```
revalidatePath를 사용할 수 있는 두 가지 장소가 있으며, 달성하려는 목표에 따라 다릅니다.
 1. Route Handlers - 서드 파티 이벤트(예:웹훅)에 응답하여 데이터를 재검증 합니다.
 2. Server Actions - 사용자 상호작용(예: 폼 제출, 버튼 클릭) 후 데이터를 재검증합니다.

 * revalidatePath vs. router.refresh:
    router.refresh를 호출하면 Router 캐시가 지워지고, Data Cache 또는 Full Route Cache를 무효화하지 않고 서버에서 경로 세그먼트가 다시 렌더링됩니다.
    차이점은 revalidatePath는 Data Cache와 Full Route Cache를 제거하는 반면, router.refresh()는 클라이언트 측 API로서 Data Cache와 Full Route Cache를 변경하지 않습니다.

### Dynamic Functions 
cookies와 headers와 같은 동적 함수 및 Pages의 searchParams prop은 런타임에서 들어오는 요청 정보에 따라 다릅니다. 이를 사용하면 경로가 Full Route Cache에서 옵트아웃 되며, 즉 경로가 동적으로 렌더링됩니다.
 - cookies
  서버 액션에서 cookies.set 또는 cookies.delete를 사용하면 쿠키를 사용하는 경로가 오래되지 않도록 ROuter Cache를 무효화합니다. (예: 인증 변경 반영)

### Segment Config Options
Route Segment Config 옵션을 사용하여 기본 경로 세그먼트를 재정의하거나 fetch API를 사용할 수 없는 경우(예:데이터베이스 클라이언트 또는 서드 파티 라이브러리)에 사용할 수 있습니다.

다음 Route Segment Config 옵션은 Data Cache와 Full Route Cache를 옵트아웃합니다

const dynamic = 'force-dynamic'
const revalidate = 0

### generateStaticParams
동적 세그먼트 (예: app/blog/[slug]/page.js)의 경우, generateStaticParams에 의해 제공된 경로는 빌드 시 Full Route Cache에 캐시됩니다. 요청 시, Next.js는 빌드 시 알 수 없었던 경로를 처음 방문할 때도 캐시합니다.

모든 경로를 빌드 시 정적으로 렌더링하려면 generateStaticParams에 전체 경로 목록을 제공하세요

```javascript
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
 
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```
일부 경로를 빌드 시 정적으로 렌더링하고 나머지는 런타임에 처음 방문할 때 렌더링하려면, 경로 목록의 일부만 반환하세요:

```javascript
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
 
  // 빌드 시 첫 10개의 게시물을 렌더링
  return posts.slice(0, 10).map((post) => ({
    slug: post.slug,
  }))
}
```
모든 경로를 처음 방문할 때 정적으로 렌더링하려면, 빈 배열을 반환하세요 (빌드 시 경로가 렌더링되지 않음) 또는 export const dynamic = 'force-static'을 사용하세요:

```javascript
export async function generateStaticParams() {
  return []
}
```

 * 알아두면 좋은 점: generateStaticParams에서 빈 배열이라도 반환해야 합니다. 그렇지 않으면 경로가 동적으로 렌더링됩니다.

```javascript
export const dynamic = 'force-static'
```
요청 시 캐싱을 비활성화하려면 경로 세그먼트에 export const dynamicParams = false 옵션을 추가하세요. 
이 컴포넌트 옵션을 사용하면 generateStaticParams에 의해 제공된 경로만 제공되며, 다른 경로는 404 오류가 발생하거나 (포괄 경로의 경우) 일치합니다.

### React cache function
React cache 함수는 함수의 반환 값을 메모이제이션하여 동일한 함수를 여러 번 호출할 때 한 번만 실행되도록 합니다.
fetch 요청은 자동으로 메모이제이션되므로 React cache로 감쌀 필요가 없습니다. 그러나 fetch API가 적합하지 않은 경우 데이터 요청을 수동으로 메모이제이션하는 데 cache를 사용할 수 있습니다. 예를 들어, 일부 데이터베이스 클라이언트, CMS 클라이언트 또는 GraphQL 클라이언트.