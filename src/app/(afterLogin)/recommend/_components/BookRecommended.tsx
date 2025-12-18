import { Users } from 'lucide-react';
import Link from 'next/link';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import StarScore from '@/components/StarScore';
import { BookSearchResponse } from '@/mocks/mockBookList';

interface BookProps {
  book: BookSearchResponse;
}

export default function BookRecommended({ book }: BookProps) {
  const { title, cover, isbn13: isbn, author, customerReviewRank: rank } = book;

  return (
    <Link
      href={`/books/${isbn}`}
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
            <StarScore value={rank} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
