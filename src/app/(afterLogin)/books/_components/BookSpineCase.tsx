'use client';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragOverEvent,
  closestCorners,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { BookInLibraryType, LibraryType } from '@/services/library.api';
import BookSpine from '../_components/BookSpine';
import Shelf from './Shelf';
import { ObjectId } from 'mongodb';

interface Props {
  books: LibraryType | undefined;
  isLoading: boolean;
}

export default function BookSpineCase({ books, isLoading }: Props) {
  const [sortedBooks, setSortedBooks] = useState<LibraryType[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findContainer = (id: string) => {
    if (id.startsWith('shelf-')) return parseInt(id.split('-')[1]);

    if (id.startsWith('placeholder-')) return parseInt(id.split('-')[1]);

    return sortedBooks.findIndex((shelf) =>
      shelf.some((book) => book._id.toString() === id),
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeShelfIdx = findContainer(activeId);
    const overShelfIdx = findContainer(overId);

    if (
      activeShelfIdx === -1 ||
      overShelfIdx === -1 ||
      activeShelfIdx === overShelfIdx
    )
      return;

    // 다른 Shelf로 넘어가는 순간 상태 업데이트
    setSortedBooks((prev) => {
      const newBooks = [...prev.map((s) => [...s])];
      const activeItems = newBooks[activeShelfIdx];
      const overItems = newBooks[overShelfIdx];

      const activeIndex = activeItems.findIndex(
        (b) => b._id.toString() === activeId,
      );

      let newIndex;
      if (overId.startsWith('shelf-') || overId.startsWith('placeholder-')) {
        // Shelf 빈 공간이나 Placeholder 위에 올렸을 때는
        // Placeholder 바로 앞(현재 shelf의 마지막에서 두 번째 자리)으로 보냄
        newIndex = overItems.length > 0 ? overItems.length - 1 : 0;
      } else {
        // 다른 실제 책 위에 올렸을 때
        newIndex = overItems.findIndex((b) => b._id.toString() === overId);
      }

      const [item] = activeItems.splice(activeIndex, 1);
      overItems.splice(newIndex, 0, item);

      return newBooks;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null); // 드래그 종료 시 activeId 초기화

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeShelfIdx = findContainer(activeId);
    const overShelfIdx = findContainer(overId);

    if (activeShelfIdx === -1 || overShelfIdx === -1) return;

    setSortedBooks((prev) => {
      const newBooks = [...prev.map((s) => [...s])];
      const activeItems = newBooks[activeShelfIdx];
      const overItems = newBooks[overShelfIdx];

      const oldIndex = activeItems.findIndex(
        (b) => b._id.toString() === activeId,
      );
      let newIndex = overItems.findIndex((b) => b._id.toString() === overId);

      // 드롭 위치가 Placeholder나 Shelf 자체라면 마지막에서 두 번째(Placeholder 바로 앞)로 설정
      if (newIndex === -1 || overId.startsWith('placeholder-')) {
        newIndex = Math.max(0, overItems.length - 1);
      }

      if (activeShelfIdx === overShelfIdx) {
        // 같은 Shelf 내 이동
        newBooks[activeShelfIdx] = arrayMove(activeItems, oldIndex, newIndex);
      } else {
        // 다른 Shelf로 최종 이동 (DragOver에서 이미 처리되었을 수 있으나 방어적 구현)
        const [movedItem] = activeItems.splice(oldIndex, 1);
        overItems.splice(newIndex, 0, movedItem);
      }

      // [중요] 모든 작업 후 각 Shelf의 Placeholder가 반드시 마지막에 있는지 재정렬 (선택사항)
      return newBooks.map((shelf) => {
        const booksOnly = shelf.filter((b) => !b.isPlaceholder);
        const placeholder = shelf.find((b) => b.isPlaceholder);
        return placeholder ? [...booksOnly, placeholder] : booksOnly;
      });
    });
  };

  useEffect(() => {
    if (books && Array.isArray(books)) {
      setSortedBooks(() => {
        const nextBooks: LibraryType[] = [[], [], []];
        books.forEach((book, i) => {
          if (i % 2) {
            book.shelf = 0;
            nextBooks[0].push(book);
          } else {
            book.shelf = 1;
            nextBooks[1].push(book);
          }
        });

        nextBooks.forEach((shelf, idx) => {
          shelf.push({
            _id: `placeholder-${idx}` as unknown as ObjectId,
            title: 'placeholder',
            isPlaceholder: true,
          } as BookInLibraryType);
        });
        return nextBooks;
      });
    }
  }, [books]);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-6xl">
      {!isLoading && sortedBooks && sortedBooks.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col">
            {sortedBooks.map((shelf, idx) => (
              <Shelf key={`shelf-${idx}`} id={`shelf-${idx}`}>
                <SortableContext
                  items={shelf.map((b) => b._id.toString())}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="bg-background-primary-hover flex min-h-67 w-full flex-wrap items-end gap-0.5 px-0.5 pt-10 shadow-[inset_0_12px_24px_-3px_rgba(12,12,13,0.1)]">
                    {shelf.map((book) => (
                      <BookSpine key={book._id.toString()} book={book} />
                    ))}
                  </div>
                  <div className="bg-background-primary h-7 border-t" />
                </SortableContext>
              </Shelf>
            ))}
          </div>
          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: { active: { opacity: '0.5' } },
              }),
            }}
          >
            {activeId ? (
              // 현재 드래그 중인 책의 정보를 찾아 렌더링
              <BookSpine
                book={
                  sortedBooks.flat().find((b) => b._id.toString() === activeId)!
                }
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="flex h-64 w-full items-center justify-center text-slate-500">
          해당하는 책이 없어요!
        </div>
      )}
    </div>
  );
}
