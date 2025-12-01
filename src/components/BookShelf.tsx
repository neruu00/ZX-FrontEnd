import { SquareLibrary } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader } from './ui/card';

const books = [
  { id: 1, title: '사피엔스', author: 'Yuval Noah Harari' },
  { id: 2, title: '1984', author: 'George Orwell' },
  { id: 3, title: '코스모스', author: 'Carl Sagan' },
  { id: 4, title: '총, 균, 쇠', author: 'Jared Diamond' },
  { id: 5, title: '이기적 유전자', author: 'Richard Dawkins' },
  { id: 6, title: '데미안', author: 'Hermann Hesse' },
  { id: 7, title: '생각에 관한 생각', author: 'Daniel Kahneman' },
  { id: 8, title: '아토믹 해빗', author: 'James Clear' },
  { id: 9, title: '명상록', author: 'Marcus Aurelius' },
  { id: 10, title: '시간의 역사', author: 'Stephen Hawking' },
  { id: 11, title: '종의 기원', author: 'Charles Darwin' },
  { id: 12, title: '손자병법', author: 'Sun Tzu' },
];

export default function BookShelf() {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <SquareLibrary size={14} />
          <span>내 책장</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[200px] items-end gap-2 border-b-8 border-amber-900/20 px-6 shadow-lg dark:border-black/30">
          {Array.from({ length: 12 }).map((_, i) => {
            const bookId = i % books.length;
            const book = books[bookId];
            const height = 65 + ((i * 7) % 25) + '%';
            const thickness = 24 + ((i * 5) % 18) + 'px';

            // Assign unique colors to each book
            const bookColors = [
              'bg-red-700',
              'bg-blue-700',
              'bg-amber-700',
              'bg-emerald-700',
              'bg-purple-700',
              'bg-rose-700',
              'bg-cyan-700',
              'bg-orange-700',
              'bg-teal-700',
              'bg-indigo-700',
              'bg-pink-700',
              'bg-lime-700',
            ];
            const bgClass = bookColors[bookId] || 'bg-zinc-700';

            return (
              <div
                key={i}
                className={`${bgClass} group relative cursor-pointer rounded-none transition-all duration-500 hover:-translate-y-2`}
                style={{
                  height: height,
                  width: thickness,
                  boxShadow: '2px 0 4px rgba(0,0,0,0.3)',
                }}
              >
                <div className={'absolute top-3 right-[3px] left-[3px] h-[2px] bg-white/10'}></div>
                <div
                  className={'absolute right-[3px] bottom-6 left-[3px] h-[6px] bg-black/20'}
                ></div>

                {/* Book Title on Hover */}
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 border border-zinc-300 bg-white px-3 py-2 text-xs whitespace-nowrap text-zinc-900 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
                  <div className="font-mono">{book.title}</div>
                  <div className={'mt-0.5 text-[10px] text-zinc-600 dark:text-zinc-500'}>
                    {book.author}
                  </div>
                </div>

                {/* Vertical Book Title */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div className="truncate px-1 text-center font-mono text-[8px] tracking-tight text-white opacity-80 [writing-mode:vertical-rl] dark:text-white">
                    {book.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
