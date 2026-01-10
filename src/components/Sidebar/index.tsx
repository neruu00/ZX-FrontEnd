'use client';

import {
  BarChart2Icon,
  BookIcon,
  ChevronRight,
  HomeIcon,
  MailIcon,
  Moon,
  Sun,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';

import DefaultProfile from '@/../public/default-profile.png';

import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';

import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const HIDDEN_PATHS = ['/books/flow', '/books/report'];

interface Props {
  children: React.ReactNode;
}

export default function Sidebar({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();
  const { setTheme, resolvedTheme: theme } = useTheme();
  const session = useSession();
  const user = session.data?.user;

  const profileImageSrc = user?.image || DefaultProfile.src;

  const onLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?') === false) return;
    await signOut({ redirect: false }).then(() => {
      router.push('/');
    });
  };

  const onClickTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isHidden = HIDDEN_PATHS.some((path) => pathname?.startsWith(path));

  if (isHidden) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <div
        className={cn([
          'flex flex-col',
          'bg-background-secondary',
          'h-dvh w-16',
          'transition-all duration-300',
          'data-[open=true]:w-48',
        ])}
        data-open={isOpen}
      >
        {/* SECTION - sidebar header */}
        <div
          className={cn([
            'flex h-16 items-center justify-between px-3.5',
            'data-[open=false]:gap-0',
          ])}
          data-open={isOpen}
        >
          <div
            className={cn([
              'flex items-center gap-2',
              'w-0',
              'transition-all duration-300',
              'overflow-hidden',
              'data-[open=true]:w-30',
            ])}
            data-open={isOpen}
          >
            <div className="bg-brand size-4.5" />
            <span className="text-xl leading-none">DOKHU</span>
          </div>
          <Button
            className="py-0 has-[>svg]:px-2.5"
            variant="ghost"
            onClick={toggle}
          >
            <ChevronRight
              className={cn([
                'transition-all, duration-300',
                isOpen ? 'rotate-180' : '',
              ])}
            />
          </Button>
        </div>
        {/* !SECTION - sidebar header */}
        <Separator />
        <div className="flex grow flex-col gap-2 px-3 py-4">
          <SidebarButton
            onClick={() => router.push('/home')}
            open={isOpen}
            active={pathname.includes('/home')}
          >
            <HomeIcon className="stroke-icon-neutral-tertiary" size={24} />
            <span>홈</span>
          </SidebarButton>

          <SidebarButton
            onClick={() => router.push('/books')}
            open={isOpen}
            active={pathname.includes('/books')}
          >
            <BookIcon className="stroke-icon-neutral-tertiary" size={24} />
            <span>서재</span>
          </SidebarButton>

          <SidebarButton onClick={() => alert('추가 예정')} open={isOpen}>
            <BarChart2Icon className="stroke-icon-neutral-tertiary" size={24} />
            <span>통계</span>
          </SidebarButton>

          <SidebarButton onClick={() => alert('추가 예정')} open={isOpen}>
            <MailIcon className="stroke-icon-neutral-tertiary" size={24} />
            <span>우편</span>
          </SidebarButton>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 p-3.5">
          <SidebarButton onClick={onClickTheme} open={isOpen}>
            <Sun className="dark:hidden" />
            <Moon className="hidden dark:block" />
            <span>테마 변경</span>
          </SidebarButton>
          <SidebarButton className="p-0" onClick={onLogout} open={isOpen}>
            <div className="relative size-9 overflow-hidden rounded-full border">
              <Image
                fill
                className="object-cover"
                src={profileImageSrc}
                alt={`${user?.name || 'User'} Profile Image`}
                placeholder="blur"
                blurDataURL={DefaultProfile.blurDataURL || DefaultProfile.src}
                sizes="36px"
              />
            </div>
            <span className="text-sm">{user?.name || 'User'}</span>
          </SidebarButton>
        </div>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}

interface SidebarButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  open?: boolean;
  active?: boolean;
}

function SidebarButton({
  children,
  className,
  onClick,
  open = true,
  active = false,
}: SidebarButtonProps) {
  return (
    <button
      className={cn([
        'flex items-center justify-start gap-2',
        'p-2',
        'text-text-neutral-tertiary',
        'hover:bg-background-tertiary-hover',
        'has-[>a,>span]:[&>a,&>span]:w-30',
        'has-[>a,>span]:[&>a,&>span]:text-start',
        'has-[>a,>span]:[&>a,&>span]:truncate',
        'has-[>a,>span]:[&>a,&>span]:transition-all',
        'has-[>a,>span]:[&>a,&>span]:duration-300',
        'data-[active=true]:text-text-brand-tertiary',
        'data-[active=true]:has-[>svg]:[&>svg]:stroke-text-brand-tertiary',
        'data-[open=false]:has-[>span]:[&>span]:w-0',
        'data-[open=false]:has-[>a]:[&>a]:w-0',
        'data-[open=false]:gap-0',
        'transition-all duration-300',
        className,
      ])}
      onClick={onClick}
      data-open={open}
      data-active={active}
    >
      {children}
    </button>
  );
}
