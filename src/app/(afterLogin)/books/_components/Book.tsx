'use client';

import { Users } from 'lucide-react';
import Link from 'next/link';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import StarScore from '@/components/StarScore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookSearchResponse } from '@/types/aladin.type';
import { useSearchParams } from 'next/navigation';

interface Props {
  book: BookSearchResponse;
}

export default function Book({ book }: Props) {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword');

  const { isbn13: isbn, cover, customerReviewRank } = book;

  const title = book.title.split('-')[0].trim();
  const author = book.author.split(',')[0].replace('(지은이)', '').trim();

  return (
    <Link
      href={`/books/${isbn}${keyword ? `?keyword=${keyword}` : ''}`}
      className="group/card relative aspect-2/3 overflow-hidden transition-transform duration-300 hover:scale-105"
    >
      <ImageWithFallback
        src={cover}
        alt={title}
        className="h-full w-full object-cover"
      />
      <Card className="bg-card/85 hover:border-grey-600 absolute bottom-0 left-0 h-full w-full border py-4 opacity-0 transition-all duration-200 group-hover/card:opacity-100">
        <CardHeader className="px-4">
          <CardTitle className="leading-[-1.5]">{title}</CardTitle>
          <CardDescription>{author}</CardDescription>
        </CardHeader>
        <CardContent className="flex grow flex-col justify-between gap-4 px-4 py-6">
          {/* <span className="text-sm underline text-zinc-400 underline-offset-4">{genre}</span> */}
        </CardContent>
        <CardFooter className="px-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <StarScore value={customerReviewRank} />
              <span>{customerReviewRank}</span>
            </div>
            <div className="flex items-center gap-1.5 border border-orange-500/20 bg-orange-500/10 px-2 py-1">
              <Users size={12} className="text-brand" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
