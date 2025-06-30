# Styling
Next.js는 애플리케이션을 스타일링 하는 다양한 방법을 지원합니다.

 - CSS Modules: local scope의 CSS 클래스를 만들어 네이밍 충돌을 방지하고 유지보수성을 향상시킵니다.
 - Global CSS: 사용하기 쉽고 전통적인 CSS에 익숙한 사람들에게 친숙하지만, 애플리케이션이 성장함에 따라 더 큰 CSS 번들을 초래하고 스타일 관리가 어려워질 수 있습니다.
 - Tailwind CSS: 유틸리티 우선 CSS 프레임워크로 유틸리티 클래스를 조합하여 빠르게 맞춤 디자인을 할 수 있습니다.
 - Sass: 변수, 중첩 규칙 및 믹스인과 같은 기느으로 CSS를 확장하는 인기 있는 CSS 전처리기입니다.
 - CSS-in-JS: CSS를 JavaScript 컴포넌트에 직접 삽입하여 동적이고 스코프된 스타일링을 가능하게 합니다.

 # Stylesheets
 Next.js는 다양한 유형의 스타일 시트를 지원합니다.
 - CSS Modules
 - Global Styles
 - External Stylesheets

 ## CSS Modules
 Next.js는 .modules.css 확장자를 사용하여 CSS Modules를 기본적으로 지원합니다.

 CSS Modules는 자동으로 고유한 클래스 이름을 생성하여 CSS를 로컬 스코프로 지정합니다. 이를 통해 다른 파일에서 동일한 클래스 이름을 충돌 없이 사용할 수 있습니다.