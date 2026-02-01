'use client';

import { useQuery } from '@tanstack/react-query';

import { getLibraryList } from '@/services/library.api';

import { Button } from '@/components/ui/button';
import { LayoutGrid, LibraryBig } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import BookSpineCase from './_components/BookSpineCase';
import BookCase from './_components/BookCase';
import PageContainer from '@/components/PageContainer';

export default function LibraryPage() {
  const [viewType, setViewType] = useState<'spine' | 'flat'>('spine');
  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: getLibraryList,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <PageContainer as="main" className="flex max-h-dvh flex-col gap-4">
      <header>
        <div className="flex justify-between">
          <h2 className="text-3xl/tight font-normal">서재</h2>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setViewType('spine')}
              className={cn([
                'rounded-sm p-2',
                viewType === 'spine'
                  ? 'stroke-icon-brand-secondary bg-background-secondary'
                  : '',
              ])}
            >
              <LibraryBig size={24} />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setViewType('flat')}
              className={cn([
                'rounded-sm p-2',
                viewType === 'flat'
                  ? 'stroke-icon-brand-secondary bg-background-secondary'
                  : '',
              ])}
            >
              <LayoutGrid size={24} />
            </Button>
          </div>
        </div>
        <div>
          <div>
            총&nbsp;
            {data?.length || 0}
            권의 도서
          </div>
        </div>
      </header>

      {viewType === 'spine' ? (
        <BookSpineCase books={data} isLoading={isLoading} />
      ) : (
        <BookCase books={data} />
      )}
    </PageContainer>
  );
}
