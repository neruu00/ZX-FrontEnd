import { Content } from '@tiptap/react';

export async function getBookReport({ isbn }: { isbn: string }) {
  try {
    const response = await fetch(`/api/books/report?query=${isbn}`, {
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
      method: 'PUT',
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
