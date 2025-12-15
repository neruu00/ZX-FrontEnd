import { Content } from '@tiptap/react';
import { ObjectId } from 'mongodb';

//TODO - isbn 검증 함수 구현
//TODO - 에러 핸들링 구체화
//TODO - 유저 인증 로직 구현
//TODO - 베이스 URL 환경변수화
//TODO - fetch 공통화
//TODO - 타입 정의 공통화
//TODO - 응답 타입 정의
//TODO - 예외 처리 구체화

export async function getBookReport({ isbn }: { isbn: string }) {
  try {
    const response = await fetch(`/api/books/report?isbn=${isbn}`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch book report');
  }
}

export async function postBookReport({
  isbn,
  title,
  content,
}: {
  isbn: string;
  title: string;
  content: Content;
}) {
  const url = '/api/books/report';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isbn,
        title,
        content,
      }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch book report');
  }
}

export async function updateBookReport({
  _id,
  title,
  content,
}: {
  _id: string;
  title: string;
  content: Content;
}) {
  const url = '/api/books/report';

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id,
        title,
        content,
      }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch book report');
  }
}
