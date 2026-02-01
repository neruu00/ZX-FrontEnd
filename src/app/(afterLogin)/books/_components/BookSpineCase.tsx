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
import { ObjectId } from 'mongodb';
import React, { useState, useEffect } from 'react';

import { BookInLibraryType, LibraryType } from '@/services/library.api';

import BookSpine from '../_components/BookSpine';

import Shelf from './Shelf';

interface Props {
  books: LibraryType | undefined;
  isLoading: boolean;
}

const DEFAULT_SHELF_COUNT = 3;
const MAX_BOOK_ORDER = 15;

export default function BookSpineCase({ books, isLoading }: Props) {
  const [sortedBooks, setSortedBooks] = useState<LibraryType[]>([]);
  const [currentActiveId, setCurrentActiveId] = useState<string | null>(null);

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
    setCurrentActiveId(event.active.id.toString());
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

    // 꽉 찼다면 아무 작업도 하지 않음
    const targetShelfBooksCount = sortedBooks[overShelfIdx].filter(
      (b) => !b.isPlaceholder,
    ).length;
    if (targetShelfBooksCount >= MAX_BOOK_ORDER) {
      return;
    }

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
    setCurrentActiveId(null); // 드래그 종료 시 activeId 초기화

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeShelfIdx = findContainer(activeId);
    const overShelfIdx = findContainer(overId);

    if (activeShelfIdx === -1 || overShelfIdx === -1) return;

    // 대상 Shelf가 꽉 찼다면 취소
    if (activeShelfIdx !== overShelfIdx) {
      const targetShelfBooksCount = sortedBooks[overShelfIdx].filter(
        (b) => !b.isPlaceholder,
      ).length;
      if (targetShelfBooksCount >= MAX_BOOK_ORDER) {
        return;
      }
    }

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

    setCurrentActiveId(null);
  };

  useEffect(() => {
    if (books && Array.isArray(books)) {
      const sorted = [...books].sort(
        (a, b) => (a.shelf || -1) - (b.shelf || -1),
      );

      setSortedBooks(() => {
        const lastShelfNum = books.at(-1)?.shelf;
        const initShelf = lastShelfNum
          ? Math.max(lastShelfNum + 1, DEFAULT_SHELF_COUNT)
          : DEFAULT_SHELF_COUNT;
        const nextBooks: LibraryType[] = Array.from(
          { length: initShelf },
          () => [],
        );

        sorted.forEach((book) => {
          if (!book.shelf) {
            const flag = nextBooks.some((shelf, idx) => {
              if (shelf.length < MAX_BOOK_ORDER) {
                book.shelf = idx;
                book.order = shelf.length;
                shelf.push(book);
                return true;
              } else return false;
            });
            if (!flag) {
              book.shelf = nextBooks.length;
              book.order = 0;
              nextBooks.push([book]);
            }
          } else nextBooks[book.shelf].push(book);
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
    <div className="mx-auto w-full max-w-240">
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
                  <div className="bg-background-primary-hover flex min-h-70 min-w-240 flex-wrap items-end gap-1 px-0.5 pt-9.5 shadow-[inset_0_12px_24px_-3px_rgba(12,12,13,0.1)]">
                    {shelf.map((book) => {
                      if (book.isPlaceholder && shelf.length >= MAX_BOOK_ORDER)
                        return null;
                      return (
                        <BookSpine
                          key={`${book._id}-${book.title}`}
                          book={book}
                        />
                      );
                    })}
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
            {currentActiveId ? (
              // 현재 드래그 중인 책의 정보를 찾아 렌더링
              <BookSpine
                book={
                  sortedBooks
                    .flat()
                    .find((b) => b._id.toString() === currentActiveId)!
                }
                isOverlay
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
