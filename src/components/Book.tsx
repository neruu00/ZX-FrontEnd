import { Star, Users } from 'lucide-react';

import { BookType } from './BookContainer';
import { ImageWithFallback } from './ImageWithFallback';
import ProgressCard from './ProgressCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface Props {
  book: BookType;
}

export default function Book({ book }: Props) {
  const { id, title, author, genre, progress, rating, status, currentReaders, cover } = book;

  return (
    <div className="group/card aspect-[2/3] overflow-hidden relative">
      <ImageWithFallback
        src={cover}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <Card className="absolute bottom-0 left-0 border-none w-full h-full bg-card/85 opacity-0 group-hover/card:opacity-100 transition-all duration-200 py-4">
        <CardHeader className="px-4">
          <CardTitle className="leading-[-1.5]">{title}</CardTitle>
          <CardDescription>{author}</CardDescription>
        </CardHeader>
        <CardContent className="grow flex flex-col gap-4 py-6 px-4 justify-between">
          <span className="text-sm underline text-zinc-400 underline-offset-4">{genre}</span>
          <ProgressCard description="진행률" value={progress} />
        </CardContent>
        <CardFooter className="px-4">
          <div className="w-full flex items-center justify-between ">
            {book.rating > 0 ? (
              <div className="flex items-center gap-0.5">
                {[...Array(book.rating)].map((_, i) => (
                  <Star key={i} size={12} className="text-orange-500 fill-orange-500" />
                ))}
              </div>
            ) : (
              <div></div>
            )}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 border border-orange-500/20">
              <Users size={12} className="text-orange-500" />
              <span className="text-label text-orange-500 font-mono">{book.currentReaders}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
