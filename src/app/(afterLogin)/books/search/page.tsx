'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import SearchField from '@/components/SearchField';
import { fetchBookSearchProxy } from '@/lib/aladin.api';
import BookCase from '../_components/BookCase';

export default function SearchBookPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('keyword');
  const isEnabledQuery = !!query && query.length > 1;

  const { data, isLoading } = useQuery({
    queryKey: ['books', query],
    queryFn: async () => fetchBookSearchProxy({ query: query || '' }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: isEnabledQuery,
  });

  return (
    <main className="m-auto w-[920px] p-4">
      <div className="flex justify-center pb-5">
        <SearchField
          defaultText={query}
          placeholder="책 제목, 저자, 장르를 입력해주세요..."
        />
      </div>
      {isLoading && <div>로딩중...</div>}
      {isEnabledQuery && !isLoading && data && <BookCase books={data.item} />}
    </main>
  );
}
