'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BookOpenIcon, FileText, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import StarScore from '@/components/StarScore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchBookDetailProxy } from '@/lib/aladin.api';
import { BookListResponse, BookSearchResponse } from '@/types/aladin.type';

export default function BookDetailPage() {
  const { isbn } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<BookSearchResponse | undefined>({
    queryKey: ['book', isbn],
    queryFn: async () => {
      if (typeof isbn !== 'string') return undefined;
      return await fetchBookDetailProxy(isbn);
    },
    initialData: () => {
      if (typeof isbn !== 'string') return undefined;
      const allBooksQueries = queryClient.getQueriesData<BookListResponse>({
        queryKey: ['books'],
      });

      if (!allBooksQueries) return undefined;
      for (const [_, bookList] of allBooksQueries) {
        const books = bookList?.item;
        const foundBook = books ? books.find((b) => b.isbn13 === isbn) : null;
        if (foundBook) return foundBook;
      }

      return undefined;
    },
    initialDataUpdatedAt: () => {
      return queryClient.getQueryState(['books'])?.dataUpdatedAt;
    },
    staleTime: 30 * 60 * 1000,
    enabled: !!isbn,
  });

  if (isLoading) return <div>로딩중...</div>;
  if (!data) return notFound();

  const title = data.title.split('-')[0].trim();
  const author = data.author.split(',')[0].replace('(지은이)', '').trim();
  const categorys = data.categoryName.split('>') as string[];
  const cover = data.cover.replace('cover200', 'cover500');

  return (
    <main className="mx-auto w-[920px] p-4">
      <div className="w-full">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-primary flex w-fit items-center gap-1 p-2"
        >
          <ArrowLeft size={16} />
          <span>뒤로가기</span>
        </Button>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-200/283 w-[280px]">
            <ImageWithFallback src={cover} alt={title} />
          </div>
          <Button
            variant="secondary"
            className="flex items-center gap-4 p-6"
            asChild
          >
            <Link href={data.link} target="_blank">
              <ShoppingCart />
              <span>구매하기</span>
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl">{title}</h1>
          <h2 className="text-xl">{author}</h2>
          <StarScore value={data.customerReviewRank} />
          <Suspense fallback={<div>로딩중...</div>}>
            <div>{categorys[categorys.length - 1]}</div>
          </Suspense>
          <div className="flex gap-4">
            <Button variant="highlight" className="grow p-6" asChild>
              <Link href={`/books/flow/${data.isbn13}`}>
                <BookOpenIcon />
                <span>몰입모드</span>
              </Link>
            </Button>
            <Button variant="secondary" className="grow p-6" asChild>
              <Link href={`/books/report/${data.isbn13}`}>
                <FileText />
                <span>독후감</span>
              </Link>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenIcon size={16} />
                <span>책 설명</span>
              </CardTitle>
            </CardHeader>
            <CardContent>{data.description}</CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
