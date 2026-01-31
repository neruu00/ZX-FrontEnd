'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { getLibraryList, LibraryType } from '@/services/library.api';
import BookSpine from '../_components/BookSpine';

// --- 4. 메인 서재 페이지 (필터링 로직 수정) ---
export default function BookSpineCase() {
  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: getLibraryList,
    staleTime: 5 * 60 * 1000,
  });

  const [books, setBooks] = useState<LibraryType>([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setBooks(data);
    }
  }, [data]);

  // (DnD 관련 코드는 기존과 동일하여 생략 가능하지만 전체 동작을 위해 유지)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBooks((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item._id === active.id);
        const newIndex = prevItems.findIndex((item) => item._id === over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl">
      {!isLoading && books && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 shadow-inner">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={books.map((b) => b._id.toString())}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-wrap items-end gap-0.5">
                {books.map((book) => (
                  <BookSpine key={book._id.toString()} book={book} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {books.length === 0 && (
            <div className="flex h-64 w-full items-center justify-center text-slate-500">
              해당하는 책이 없어요!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
