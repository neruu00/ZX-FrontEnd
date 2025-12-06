'use client';

import { usePathname } from 'next/navigation';

import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const hideSidebarPaths = ['/books/flow', '/books/report'];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 현재 경로가 숨김 목록에 포함되는지 확인
  const shouldHideSidebar = hideSidebarPaths.some((path) => pathname?.startsWith(path));

  // 사이드바를 숨겨야 한다면 children만 반환
  if (shouldHideSidebar) {
    return <>{children}</>;
  }

  // 아니라면 사이드바와 함께 렌더링
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
