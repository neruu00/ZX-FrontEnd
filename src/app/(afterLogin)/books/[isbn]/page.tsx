import { notFound } from 'next/navigation';

import { fetchBookLookUp } from '@/lib/aladin.api';

interface Props {
  params: Promise<{ isbn: string }>;
}

export default async function BookPage({ params }: Props) {
  const { isbn } = await params;

  let book = null;
  try {
    const result = await fetchBookLookUp(isbn);
    book = Array.isArray(result) ? result[0] : result;
    console.log(book);
  } catch (error) {
    console.error(error);
  }

  if (!book) return notFound();

  return (
    <main className="m-auto w-[920px] p-4">
      <h1>book Page</h1>
    </main>
  );
}
