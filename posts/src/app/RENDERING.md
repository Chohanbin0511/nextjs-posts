# !Rendering

랜더링은 작성한 코드를 사용자 인터페이스로 변환하는 과정입니다. React와 Next.js를 사용하면 코드의 일부를 서버 또는 클라이언트에서 랜더링할 수 있는 하이브리드 웹 애플리케이션을 만들 수 있습니다. 
랜더링 환경, 전략 및 런타임의 차이점을 이해해야 합니다.

## Fundamentals
세가지 기본적인 웹 개념에 익숙해져아 합니다.
- 애플리케이션 코드가 실행될 수 있는 Environments: 서버와 클라이언트
- 사용자가 애플리케이션을 방문하거나 상호작용할 때 시작 되는 Request-Response Lifecycle
- 서버와 클라이언트 코드를 분리하는 Network Boundary.

### Rendering Environments
웹 애플리케이션이 렌더링 될 수 있는 두 가지 환경이 있습니다. 클라이언트와 서버
 - 클라이언트는 사용자 장치의 브라우저를 의미하며, 서버에 애플리케이션 코드를 요청하고 서버의 응답을 사용자 인터페이스로 변환합니다.
 - 서버는 데이터 센터의 컴퓨터를 의미하며, 애플리케이션 코드를 저장하고 클라이언트의 요청을 받아 적절한 응답을 보냅니다.

역시적으로 개발자들은 서버와 클라이언트에서 코드를 작성할 때 다른 언어(e.g. javaScript, PHP)와 프레임 워크를 사용해야 했습니다. React를 사용하면 같은 언어(Javascript)와 같은 프레임워크(e.g. Next.js 또는 선택한 프레임워크)를 사용할 수 있습니다. 이러한 유연성 덕분에 컨텍스트 전환 없이 두 환경 모두에 대해 코드를 작성할 수 있습니다.

그러나 각 환경에는 고유한 기능과 제약이 있습니다. 따라서 서버와 클라이언트에 대한 코드는 항상 동일하지 않습니다.
데이터 페칭이나 사용자 상태 관리와 같은 특정 작업은 한 환경에서 다른 환경보다 적합할 수 있습니다.
이러한 차이점을 이해하는 것이 React와 Next.js를 효과적으로 사용하는 데 중요합니다. Server 및 Client Components 페이지에서 차이점과 사용 사례를 보고 이해하십시오

### Request-Response Lifecycle
대체로 모든 웹사이트는 동일한 Request-Response Lifecycle을 따릅니다
 1. 사용자 액션
 - 사용자가 웹 애플리케이션과 상호작용합니다. 링크 클릭, 폼 제출, 브라우저 주소창에 URL 직접 입력 등이 이에 해당합니다.
 2. HTTP 요청
 - 클라이언트는 서버에 필요한 리소스가 무엇인지, 어떤 메서드(e.g. GET, POST)가 사용되는지, 추가 데이터가 필요한지를 포함하는 HTTP 요청을 보냅니다.
 3. 서버
 - 서버는 요청을 처리하고 적절한 리소스로 응답합니다. 이 과정은 라우팅, 데이터 페칭 등의 여러 단계를 거칠 수 있습니다.
 4. HTTP 응답
 - 서버는 요청을 처리한 후 클라이언트에게 HTTP 응답을 보냅니다. 이 응답에는 상태코드(요청이 성공 했는지 여부를 클라이언트에게 알림)와 요청된 리소스(e.g. HTML, CSS, JavaScript, 정적 자산 등)가 포함됩니다.
 5. 클라이언트
 - 클라이언트는 리소스를 파싱하여 사용자 인터페이스를 렌더링 합니다.
 6. 사용자 액션
 - 사용자 인터페이스가 렌더링되면 사용자가 상호작용할 수 있으며, 전체 프로세스가 다시 시작됩니다

 하이브리드 웹 애플리케이션을 구축하는 주요 부분은 라이프사이클에서 작업을 분할하는 방법과 Network Boundary를 어디로 둘지 결정하는 것입니다.

 ### Network Boundary
 웹 개발에서 Network Boundary는 다양한 환경을 분리하는 개념적 경계선입니다. 예를 들어, 클라이언트와 서버, 또는 서버와 데이터 저장소를 구분합니다.
 React에서는 클라이언트-서버 네트워크 경계를 가장 적절한 위치에 배치할 수 있습니다.
 
 백그라운드에서는 작업이 두 부분으로 나뉩니다.
 - 클라이언트 모듈그래프와 서버 모듈 그래프
 서버 모듈 그래프는 서버에서 랜더링되는 모든 컴포넌트를 포함하며, 클라이언트 모듈 그래프는 클라이언트에서 렌더링되는 모든 컴포넌트를 포함합니다.
 모듈 그래프는 애플리케이션의 파일들이 서로 어떻게 의존하는지에 대한 시각적 표현으로 생각할 수 있습니다.

 React의 "use client" 지시어를 사용하여 경계를 정의할 수 있습니다. 또한 "use server" 지시어도 있어 서버에서 일부 계산 작업을 수행하도록 React에 지시합니다.

 ### Building Hybrid Applications
 이 환경에서 작업할때 애플리케이션의 코드 흐름을 단방향으로 생각하는 것이 도움이 됩니다. 즉, 응답 중에 애플리케이션 코드는 서버에서 클라이언트로 한 방향으로 흐릅니다.

 클라이언트에서 서버에 접근해야 하는 경우, 동일한 요청을 재사용하는 대신 새로운 요청을 서버로 보냅니다. 이렇게 하면 컴포넌트를 어디서 렌더링할지, Network Boundary를 어디에 둘지 쉽게 이해할 수 있습니다.

 실제로 이 모델은 개발자들이 먼저 서버에서 실행할 내용을 생각한 다음, 그 결과를 클라이언트로 보내 애플리케이션을 인터렉티브하게 만드는 것을 장려합니다.
 이 개념은 동일한 컴포넌트 트리 내에서 클라이언트와 서버 컴포넌트를 교차하는 방법(Composition Patterns)을 살펴보세요

# Partial Prerendering (실험적 기능) 참고만 하기

Partial Prerendering (PPR)은 동일한 경로에서 정적 렌더링과 동적 렌더링의 이점을 결합하는 렌더링 전략입니다. PPR을 사용하면, Suspense(opens in a new tab) 경계 안에 동적 컴포넌트를 감쌀 수 있습니다. 새로운 요청이 들어오면 Next.js는 캐시에서 즉시 정적 HTML 셸을 제공한 다음, 동적 부분을 동일한 HTTP 요청에서 렌더링하고 스트리밍합니다.
## Incremental Adoption
Next.js 15에서는 next.config.js 파일에서 ppr 옵션을 incremental로 설정하고 파일 상단에 experimental_ppr 라우트 구성 옵션을 내보내어 레이아웃 및 페이지에서 점진적으로 Partial Prerendering을 도입할 수 있습니다:

# Server Components
React Server Components를 사용하면 UI를 서버에서 렌더링하고 선택적으로 캐시할 수 있습니다. Next.js에서는 렌더링 작업이 경로 세그먼트 별로 분할되어 스트리밍 및 부분 렌더링이 가능하며, 세 가지 다른 서버 렌더링 전략이 있습니다.
- Static Rendering
- Dynamic Rendering
- Streaming
Server Components가 어떻게 작동하는지, 언제 사용하면 좋은지, 다양한 서버 렌더링 전략에 대해 알아가야합니다.

## Benefits of Server Rendering
서버에서 렌더링 작업을 수행하면 몇가지 이점이 있습니다.
- 데이터 페칭: Server Components를 사용하면 데이터 소스에 더 가까운 서버에서 데이터 페칭을 수행할 수 있습니다. 이는 렌더링에 필요한 데이터를 가져오는 시간을 줄이고 클라이언트에서 요청해야 하는 횟수를 줄여 성능을 향상시킬 수 있습니다.
- 보안: Server Components를 사용하면 토큰이나 API 키와 같은 민감한 데이터와 로직을 클라이언트에 노출될 위험 없이 서버에 유지할 수 있습니다.
- 캐싱: 서버에서 렌더링함으써 결과를 캐시하고 이후 요청과 사용자 간에 재사용이 가능합니다. 이는 각 요청시 수행되는 렌더링과 데이터 페칭의 양을 줄여 성능을 향상시키고 비용을 절감할 수 있습니다.
- 성능: Server Components는 성능을 최적화할 수 있는 추가 도구를 제공합니다. 예를 들어, 완전히 Client Components로 구성된 앱에서 비인터렉티브 UI 부분을 Server Components로 이동하면 클라이언트 측 JavaScript 양을 줄일 수 있습니다. 이는 느린 인터넷 또는 성능이 낮은 장치를 사용하는 사용자에게 유리합니다.
- 초기 페이지 로드 및 First Contentful Paint (FCP): 서버에서 HTML을 생성하여 사용자가 페이지를 즉시 볼 수 있게 하고, 클라이언트가 페이지를 렌더링하는 데 필요한 JavaScript를 다운로드, 파싱 및 실행할 필요가 없습니다.
- 검색 엔진 최적화 및 소셜 네트워크 공유 가능성: 렌더링된 HTML은 검색 엔진 봇이 페이지를 인덱싱하고 소셜 네트워크 봇이 페이지의 소셜 카드 미리보기를 생성하는데 사용할 수 있습니다.
- 스트리밍: Server Components를 사용하면 렌더링 작업을 청크로 분할하고 준비되는 대로 클라이언트에 스트리밍할 수 있습니다. 이를 통해 전체 페이지가 서버에서 렌더링될 때까지 기다리지 않고도 사용자가 페이지의 일부를 먼저 볼 수 있습니다.

## Using Server Components in Next.js
기본적으로 Next.js는 Server Components를 사용합니다. 이를 통해 추가 구성 없이 서버 렌더링을 자동으로 구현할 수 있으며, 필요에 따라 Client Components를 사용할 수 있습니다.

## How are Server Components rendered?
서버에서 Next.js는 React의 API를 사용하여 렌더링을 조정합니다. 렌더링 작업은 개별 경로 세그먼트와 Suspense Boundaries에 따라 청크로 분할됩니다.

각 청크는 두 단계로 렌더링 됩니다.
 1. React는 Server Components를 "React Server Component Payload (RSC Payload)"라는 특별한 데이터 형식으로 렌더링합니다.
 2. Next.js 는 RSC Payload와 Client Component JavaScript 지침을 사용하여 서버에서 HTML을 렌더링합니다.
그런 다음 클라이언트에서는
 1. HTML을 사용하여 경로의 빠른 비인터렉티브 미리보기를 즉시 표시합니다. -> 초기 페이지 로드에만 해당됨
 2. React Server Components Payload를 사용하여 Client와 Server Component 트리를 조정하고 DOM을 업데이트 합니다.
 3. JavaScript 지침을 사용하여 Client Components의 하이드레이션하고 애플리케이션을 인터랙티브하게 만듭니다.

 * 하이드레이션이란?
 hydrateRoot를 사용하면 이전에 react-dom/server에서 생성된 HTML 콘텐츠가 있는 브라우저 DOM 노드 내부에 React 구성 요소를 표시할 있습니다.
 const root = hydrateRoot(domNode, reactNode, options?)

 * React Server Component Payload (RSC)란 무엇인가?
 RSC Payload는 렌더링된 React Server Components 트리의 간결한 이진 표현입니다. 이는 클라이언트에서 React가 브라우저의 DOM을 업데이트하는 데 사용됩니다. 
 
  RSC Payload 내용
 - Server Components의 렌더링된 결과
 - Client Components가 렌더링되어야 할 위치와 해당 JavaScript 파일에 대한 참조
 - Server Component에서 Client Component로 전달된 모든 props

## Server Rendering Strategies
서버 렌더링에는 세가지 하위 집단이 있습니다. Static, Dynamic, Streaming

### Static Rendering (Default)
Static Rendering에서는 빌드 타임 또는 데이터 재검증 후 백그라운드에서 경로가 렌더링됩니다. 결과는 캐시되며 Content Delivery Network(CDN)에 푸시될 수 있습니다. 이 최적화는 사용자와 서버 요청 간에 렌더링 작업의 결과를 공유할 수 있게 합니다.

Static Rendering은 사용자에게 개인화되지 않은 데이터가 있으며 빌드 타임에 알 수 있는 경로(예: 정적 블로그 게시물 또는 제품 페이지)에 유용합니다.

### Dynamic Rendering
Dynamic Rendering에서는 경로가 요청 시 각 사용자에 대해 렌더링됩니다.
Dynamic Rendering은 사용자에게 개인화된 데이터가 있거나 요청 시에만 알 수 있는 정보(예: 쿠키 또는 URL의 검색 매개변수)가 있는 경로에 유용합니다.
 * 캐시된 데이터가 있는 동적 경로
  대부분의 웹 사이트에서는 경로가 완전히 정적이거나 완전히 동적이지 않습니다 - 이는 스펙트럼입니다. 예를들어, 일정 간격으로 재검증되는 캐시된 제품 데이터를 사용하는 전자 상거래 페이지와 개인화된 고객 데이터를 포함하는 경우가 있습니다.

  Next.js에서는 캐시된 데이터와 캐시되지 않은 데이터를 모두 사용하는 동적으로 렌더링된 경로를 가질 수 있습니다. 이는 RSC Payload와 데이터가 별도로 캐시되기 때문에 가능합니다. 이를 통해 모든 데이터를 요청 시 가져오는 성능 영향을 걱정하지 않고 동적 렌더링을 선택할 수 있습니다.

  전체 경로 캐시 및 데이터 캐시에 대해 공부하세요.

### Switching to Dynamic Rendering
렌더링 중에 동적 함수 또는 캐시되지 않은 데이터 요청이 발견되면, Next.js는 전체 경로를 동적으로 렌더링하도록 전환합니다. 이 표는 동적 함수와 데이터 캐싱이 경로가 정적 또는 동적으로 렌더링되는지 여부에 어떻게 영향을 미치는지 요약합니다.

|동적 함수 |	데이터	    |    경로         |
|아니요    |   캐시됨	    | 정적으로 렌더링됨 |
|예	      |   캐시됨	   | 동적으로 렌더링됨 |
|아니요	   | 캐시되지 않음   | 동적으로 렌더링됨 | 
|예	      |  캐시되지 않음  | 동적으로 렌더링됨 |

위 표에서 경로가 완전히 정적이 되려면 모든 데이터가 캐시되어야 합니다. 그러나 캐시된 데이터 페칭과 캐시되지 않은 데이터 페칭을 모두 사용하는 동적으로 렌더링 된 경로를 가질 수 있습니다.

개발자로서 정적 렌더링과 동적 렌더링 중에서 선택할 필요는 없습니다. Next.js는 사용된 기능과 API에 따라 각 경로에 가장 적합한 렌더링 전략을 자동으로 선택합ㄴ디ㅏ. 대신 특정 데이터를 캐시하거나 재검증 시기를 선택하고, UI의 일부를 스트리밍할 시기를 선택할 수 있습니다.

### Dynamic Functions 
동적 함수는 사용자의 쿠키, 현재 요청 헤더 또는 URL의 검색 매개변수와 같이 요청 시에만 알 수 있는 정보에 의존합니다. Next.js에서 이러한 동적 API는 다음고 같습니다.
 - cookies()
 - headers()
 - unstable_noStore()
 - unstable_after()
 - searchParams_prop

 이 함수들 중 하나를 사용하면 전체 경로가 요청 시 동적으로 렌더링 됩니다.

 ## Streaming
 스트리밍을 통해 서버에서 UI를 점진적으로 렌더링할 수 있습니다. 작업은 청크로 나누어지고 준비되는 대로 클라이언트에 스트리밍됩니다. 이를 통해 전체 콘텐츠가 렌더링될 때까지 기다리지 않고도 사용자가 페이지의 일부를 즉시 볼 수 있습니다.

 스트리밍은 Next.js App Router에 기본적으로 내장되어 있습니다. 이는 초기 페이지 로딩 성능을 향상시키고, 전체 경로를 렌더링하는 데 방해가 되는 느린 데이터 페칭에 의존하는 UI를 개선합니다. 예를 들어, 제품 페이지의 리뷰가 해당됩니다.

 loading.js와 UI 컴포넌트를 React Suspense를 사용하여 경로 세그먼트 스트리밍을 시작할 수 있습니다.


# Client Components
Client Components를 사용하면 서버에서 미리 렌더링된 후 클라이언트 JavaScript를 사용하여 브라우저에서 실행할 수 있는 인터랙티브 UI를 작성할 수 있습니다.

Client Components가 어떻게 작동하는지, 어떻게 렌더링 되는지, 그리고 언제 사용하면 좋은지 알아두세요.

## Benefits of Client Rendering
클라이언트에서 렌더링 작업을 수행했을때 이점
- 상호작용: Client Components는 상태, 효과 및 이벤트 리스너를 사용할 수 있으므로 사용자에게 즉각적인 피드백을 제공하고 UI를 업데이트할 수 있습니다.
- 브라우저 API: Client Components는 Geo location이나 Local storage와 같은 browser API에 접근할 수 있습니다.

## Using Client Components in Next.js
Client Components를 사용하려면 파일 상단에 React "use client" 지시어를 import 위에 추가하면 됩니다.

"use client"는 Server와 Client Component 모듈 간의 경계를 선언하는 데 사용됩니다. 즉, 파일에 "use client"를 정의하면 해당 파일에 import된 모든 모듈, 자식 컴포넌트를 포함하여 클라이언트 번들의 일부로 간주됩니다.

중첩된 컴포넌트에서 onClick 및 useState를 사용할 때 "use client" 지시어가 정의되지 않으면 오류가 발생하는 이유를 보여줍니다.
기본적으로 App Router의 모든 컴포넌트는 이러한 API가 사용되지 않은 Server Components 입니다. "use client" 지시어를 정의함으로써 이러한 API가 사용 가능한 클라이언트 경계에 들어가도록 React에 지시할 수 있습니다.

 ---------------------------------------------------------------------------------------------------------------------------
 * 여러 "use client" 진입점을 정의하는 경우
 React Component 트리에서 여러 "use client" 진임점을 정의할 수 있습니다. 이를 통해 애플리케이션을 여러 클라이언트 번들로 분할할 수 있습니다.
 그러나, 클라이언트에서 렌더링해야 하는 모든 컴포넌트에 "use client"를 정의할 필요는 없습니다. 한 번 경계를 정의하면 모든 자식 컴포넌트와 import된 모듈이 클라이언트 번들의 일부로 간주됩니다.
 ---------------------------------------------------------------------------------------------------------------------------

 ## How are Client Components Rendered?
 Next.js 에서 Client Components는 요청이 전체 페이지 로드(애프리케이션을 처음 방문하거나 브라우저 새로 고침으로 인한 페이지 다시 로드)인지 또는 후속 탐색인지에 따라 다르게 렌더링됩니다.

 ### Full page load
 초기 페이지 로드를 최적화 하기 위해 Next.js는 Client 및 Server Components에 대해 서버에서 정적 HTML 미리보기를 렌더링하기 위해 React의 API를 사용합니다. 즉, 사용자가 애플리케이션을 처음 방문할 때 클라이언트가 Client Component JavaScript 번들을 다운로드, 파싱 및 실행할 필요 없이 페이지 내용을 즉시 볼 수 있습니다.

  * 서버에서는
  1. HTML을 사용하여 경로의 빠른 비인터렉티브 초기 미리보기를 즉시 표시합니다 .
  2. Next.js는 RSC Payload와 Client Component JavaScript 지침을 사용하여 서버에서 경로에 대한 HTML을 렌더링합니다.

  * 클라이언트에서는
  1. HTML을 사용하여 경로의 빠른 비인터랙티브 초기 미리보기를 즉시 표시합니다.
  2. React Server Components Payload를 사용하여 Client와 Server Component 트리를 조정하고 DOM을 업데이트 합니다.
  3. JavaScript 지침을 사용하여 Client Components를 하이드레이션 하고 UI를 인터렉티브하게 만듭니다.
  
  * 하이드레이션이란?
  하이드레이션은 이벤트 리스너를 DOM에 연결하여 정적 HTML을 인터랙티브하게 만드는 과정입니다. 
  하이드레이션은 hydrateRoot(opens in a new tab) React API를 사용하여 백그라운드에서 수행됩니다.

## Subsequent Navigations
후속 탐색에서는 Client Components가 서버 렌더링된 HTML 없이 클라이언트에서 완전히 렌더링 됩니다.

이는 Client Component JavaScript 번들이 다운로드 되고 파싱됨을 의미합니다. 번들이 준비되면 React는 RSC Payload를 사용하여 Client와 Server Component트리를 조정하고 DOM을 업데이트 합니다.

## Going back to the Server Environment
때때로 "use client" 경계를 선언한 후 서버 환경으로 돌아가고 싶을 수 있습니다. 예를 들어, 클라이언트 번들 크기를 줄이거나 서버에서 데이터를 페칭하거나 서버에서만 사용 가능한 API를 사용하고 싶을 때가 있습니다.

Client Components 내부에 이론적으로 중첩된 코드를 유지하면서도 Server Components 및 Server Actions를 사용하여 코드를 서버에 유지할 수 있습니다. 자세한 내용은 Composition Patterns 페이지 참조.