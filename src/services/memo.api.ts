export async function getMemos({ isbn13 }: { isbn13: string }) {
  try {
    const response = await fetch(`/api/books/memos?isbn13=${isbn13}`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch memos');
  }
}

export async function postMemo({
  isbn13,
  content,
}: {
  isbn13: string;
  content: string;
}) {
  try {
    const response = await fetch('/api/books/memos', {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isbn13, content }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to post memo');
  }
}

export async function updateBookMemo({
  _id,
  content,
}: {
  _id: string;
  content: string;
}) {
  const url = '/api/books/memos';

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id,
        content,
      }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch book memo');
  }
}

export async function deleteBookMemo({ _id }: { _id: string }) {
  const baseUrl = '/api/books/memos';
  const apiParams = new URLSearchParams({ _id });
  const url = `${baseUrl}?${apiParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch book memo');
  }
}
