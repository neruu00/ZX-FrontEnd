import SidebarLayout from '@/layouts/SidebarLayout';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
