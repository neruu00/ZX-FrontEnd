import { ArrowLeft, BookOpenIcon, FileText, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import StarScore from '@/components/StarScore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchBookDetail } from '@/lib/aladin.api';
import { BookLookUpResponse } from '@/types/aladin.type';

interface Props {
  params: Promise<{ isbn: string }>;
}

export default async function BookPage({ params }: Props) {
  const { isbn } = await params;

  let book = null;
  try {
    const result = await fetchBookDetail(isbn);
    book = (Array.isArray(result) ? result[0] : result) as BookLookUpResponse;
  } catch (error) {
    console.error(error);
  }

  if (!book) return notFound();

  const title = book.title.split('-')[0].trim();
  const author = book.author.split(',')[0].replace('(지은이)', '').trim();
  const categorys = book.categoryName.split('>') as string[];

  const cover = book.cover.replace('cover200', 'cover500');

  return (
    <main className="mx-auto w-[920px] p-4">
      <div className="w-full">
        <Link
          href="/library"
          className="text-muted-foreground hover:text-primary flex w-fit items-center gap-1 p-2"
        >
          <ArrowLeft size={16} />
          <span>서재로 돌아가기</span>
        </Link>
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
            <Link href={book.link}>
              <ShoppingCart />
              <span>구매하기</span>
            </Link>
          </Button>
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
