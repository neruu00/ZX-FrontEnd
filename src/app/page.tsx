import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function RandingPage() {
  return (
    <main className="p-4">
      <h1>Randing Page</h1>
      <div className="flex w-[120px] flex-col gap-4">
        <Button asChild>
          <Link href="/home">대시보드</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">회원가입</Link>
        </Button>
        <Button asChild>
          <Link href="/login">로그인</Link>
        </Button>
      </div>
    </main>
  );
}
