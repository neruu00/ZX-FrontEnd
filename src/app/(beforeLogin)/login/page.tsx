'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [message, setMessage] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        username: id,
        password,
        redirect: false,
      });
      console.log(result);
      router.push('/home');
    } catch (error) {
      console.error(error);
      setMessage('로그인에 실패했습니다.');
    }
  };

  return (
    <div>
      <div>Login Page</div>
      <form
        className="mx-auto mt-12 flex w-[320px] flex-col gap-4 bg-[#333333] p-4"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email">아이디</label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="아이디를 입력하세요..."
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">비밀번호</label>
          <input
            type="text"
            id="password"
            name="password"
            placeholder="비밀번호를 입력하세요..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Button type="submit">로그인</Button>
          <div className="text-destructive">{message}</div>
        </div>
      </form>
    </div>
  );
}
