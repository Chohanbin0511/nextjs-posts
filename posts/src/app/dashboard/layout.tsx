export default function DashboardLayout({
  children, // 페이지 또는 중첩 레이아웃이 될 것임
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      {/* 여기에는 헤더나 사이드바와 같은 공유 UI를 포함하세요 */}
      <nav></nav>
 
      {children}
    </section>
  )
}