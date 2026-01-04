'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  BookOpenIcon,
  FileText,
  PlusIcon,
  ShoppingCart,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import StarScore from '@/components/StarScore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchBookDetailProxy } from '@/lib/aladin.api';
import { BookListResponse, BookSearchResponse } from '@/types/aladin.type';
import { getLibrary, postLibrary } from '@/services/library.api';

export default function BookDetailPage() {
  const { isbn } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: book, isLoading: isBookLoading } = useQuery<
    BookSearchResponse | undefined
  >({
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

  const { data: library, isLoading: isLibraryLoading } = useQuery({
    queryKey: ['library'],
    queryFn: getLibrary,
  });

  const { mutate } = useMutation({
    mutationFn: postLibrary,
  });

  if (isBookLoading) return <div>로딩중...</div>;
  if (!book) return notFound();

  const title = book.title.split('-')[0].trim();
  const author = book.author.split(',')[0].replace('(지은이)', '').trim();
  const categorys = book.categoryName.split('>') as string[];
  const cover = book.cover.replace('cover200', 'cover500');
  const isBookInLibrary =
    !!library && library.some((l) => l.isbn13 === book.isbn13);

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
            <Link href={book.link} target="_blank">
              <ShoppingCart />
              <span>구매하기</span>
            </Link>
          </Button>
          {!isLibraryLoading && !isBookInLibrary ? (
            <Button
              className="flex items-center gap-4 p-6"
              onClick={() => mutate(book)}
            >
              <PlusIcon size={16} />
              <span>서재에 추가하기</span>
            </Button>
          ) : (
            <Button className="flex items-center gap-4 p-6">
              <XIcon size={16} />
              <span>서재에서 제거하기</span>
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl">{title}</h1>
          <h2 className="text-xl">{author}</h2>
          <StarScore value={book.customerReviewRank} />
          <Suspense fallback={<div>로딩중...</div>}>
            <div>{categorys[categorys.length - 1]}</div>
          </Suspense>
          <div className="flex gap-4">
            <Button variant="highlight" className="grow p-6" asChild>
              <Link href={`/books/flow/${book.isbn13}`}>
                <BookOpenIcon />
                <span>몰입모드</span>
              </Link>
            </Button>
            <Button variant="secondary" className="grow p-6" asChild>
              <Link href={`/books/report/${book.isbn13}`}>
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
            <CardContent>{book.description}</CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
