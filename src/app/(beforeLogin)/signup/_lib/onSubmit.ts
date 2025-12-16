'use server';

import { redirect } from 'next/navigation';

export default async function onSubmit(
  currentState: { message: string | null },
  formData: FormData,
) {
  const email = formData.get('email');
  const name = formData.get('name');
  const password = formData.get('password');
  const passwordConfirm = formData.get('passwordConfirm');

  if (!email) {
    return { message: '이메일을 입력하세요.' };
  }
  if (!name) {
    return { message: '이름을 입력하세요.' };
  }
  if (!password) {
    return { message: '비밀번호를 입력하세요.' };
  }
  if (!passwordConfirm) {
    return { message: '비밀번호 확인을 입력하세요.' };
  }
  if (password !== passwordConfirm) {
    return { message: '비밀번호가 일치하지 않습니다.' };
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`;
    console.log(url);
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    if (!response.ok) {
      return { message: '회원가입에 실패했습니다.' };
    }
    if (response.status === 403) {
      return { message: '이미 존재하는 이메일입니다.' };
    }
  } catch (error) {
    console.error(error);
    return { message: '회원가입에 실패했습니다.' };
  }

  redirect('/home');
  return { message: '회원가입에 성공했습니다.' };
}
