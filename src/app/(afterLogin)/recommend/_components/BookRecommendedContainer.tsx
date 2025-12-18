'use client';

import { useQuery } from '@tanstack/react-query';
import BookRecommended from './BookRecommended';
import { fetchBookListProxy } from '@/lib/aladin.api';

export default function BookRecommendedContainer() {
  const { data } = useQuery({
    queryKey: ['books', 'recommended'],
    queryFn: fetchBookListProxy,
  });

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
      {data?.item.map((book) => (
        <BookRecommended key={book.isbn13} book={book} />
      ))}
    </div>
  );
}
