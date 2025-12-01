'use client';

import { BookmarkIcon, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';

import ProgressCard from './ProgressCard';

const Data = {
  title: '사피엔스',
  author: '유발 하라리',
  genre: '인문/역사',
  page: 300,
  read: 252,
};

export default function BookMark() {
  //TODO - fetch data
  const { title, author, genre, page, read } = Data;
  const progress = (read / page) * 100;

  return (
    <Card className="w-[320px]">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <BookmarkIcon size={14} />
          <span>책갈피</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <div className="text-primary mb-2 text-2xl font-bold">{title}</div>
          <div className="text-muted-foreground mb-4 text-sm">
            {author} · {genre}
          </div>
        </div>
        <ProgressCard className="mb-6" description={`${read}/${page}`} value={progress} />
      </CardContent>
      <CardFooter>
        <Button variant="highlight" className="text-primary-foreground w-full py-6">
          <Play fill="currentColor" />
          <span>계속읽기</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
