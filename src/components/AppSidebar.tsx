'use client';

import { BookOpen, ChevronRight, FileText, Home, Moon, Settings, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';

const items = [
  {
    title: '홈',
    url: '/home',
    icon: Home,
  },
  {
    title: '서재',
    url: '/library',
    icon: BookOpen,
  },
  { title: '독후감', url: '/book/write', icon: FileText },
];

export default function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();
  const path = usePathname();
  const { setTheme, resolvedTheme: theme } = useTheme();

  const onClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <ChevronRight
            className={cn([open ? 'rotate-180' : '', 'transition-transform duration-300'])}
          />
        </Button>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={path.includes(item.url)}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div onClick={onClick}>
                <Sun className="dark:hidden" />
                <Moon className="hidden dark:block" />
                <span>테마 변경</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Settings />
                <span>설정</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
