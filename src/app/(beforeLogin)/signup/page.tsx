'use client';

import { Button } from '@/components/ui/button';
import Form from 'next/form';
import onSubmit from './_lib/onSubmit';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';

export default function SignupPage() {
  const [state, formAction] = useActionState(onSubmit, {
    message: '',
  });
  const { pending } = useFormStatus();

  return (
    <div>
      <div>Signup Page</div>

      <Form
        className="mx-auto mt-12 flex w-[320px] flex-col gap-4 bg-[#333333] p-4"
        action={formAction}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email">아이디</label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="아이디를 입력하세요..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일을 입력하세요..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="이름을 입력하세요..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">비밀번호</label>
          <input
            type="text"
            id="password"
            name="password"
            placeholder="비밀번호를 입력하세요..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            type="text"
            id="passwordConfirm"
            name="passwordConfirm"
            placeholder="비밀번호를 다시 입력하세요..."
          />
        </div>
        <div>
          <Button type="submit" disabled={pending}>
            회원가입
          </Button>
          <div className="text-destructive">{state.message}</div>
        </div>
      </Form>
    </div>
  );
}
