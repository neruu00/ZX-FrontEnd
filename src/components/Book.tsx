'use client';

import { Star, Users } from 'lucide-react';

import searchBook from '@/lib/searchBook';
import { BookType } from '@/mock/user';

import { ImageWithFallback } from './ImageWithFallback';
import ProgressCard from './ProgressCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface Props {
  book: BookType;
}

export default function Book({ book }: Props) {
  const { title, author, isbn, page, readPage, cover, rank } = book;

  const progress = Math.round((readPage / page) * 10000) / 100;

  const handleSearch = async () => {
    if (!isbn) return;
    if (confirm('search?')) searchBook.aladin(isbn);
  };

  return (
    <div
      className="group/card relative aspect-[2/3] overflow-hidden transition-transform duration-300 hover:scale-105"
      onClick={handleSearch}
    >
      <ImageWithFallback src={cover} alt={title} className="h-full w-full object-cover" />
      <Card className="bg-card/85 hover:border-grey-600 absolute bottom-0 left-0 h-full w-full border-1 py-4 opacity-0 transition-all duration-200 group-hover/card:opacity-100">
        <CardHeader className="px-4">
          <CardTitle className="leading-[-1.5]">{title}</CardTitle>
          <CardDescription>{author}</CardDescription>
        </CardHeader>
        <CardContent className="flex grow flex-col justify-between gap-4 px-4 py-6">
          {/* <span className="text-sm underline text-zinc-400 underline-offset-4">{genre}</span> */}
          <ProgressCard description="진행률" value={progress} />
        </CardContent>
        <CardFooter className="px-4">
          <div className="flex w-full items-center justify-between">
            {book.rank > 0 ? (
              <div className="flex items-center gap-0.5">
                {[...Array(Math.round(rank / 2))].map((_, i) => (
                  <Star key={i} size={12} className="text-brand fill-brand" />
                ))}
              </div>
            ) : (
              <div></div>
            )}
            <div className="flex items-center gap-1.5 border border-orange-500/20 bg-orange-500/10 px-2 py-1">
              <Users size={12} className="text-brand" />
              <span className="text-label text-brand font-mono">{book.readPage}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
