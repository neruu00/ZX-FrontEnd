'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragOverEvent,
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
import Shelf from './Shelf';

export default function BookSpineCase() {
  const [books, setBooks] = useState<LibraryType[]>([]);
  const [currentActiveId, setCurrentActiveId] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: getLibraryList,
    staleTime: 5 * 60 * 1000,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findContainer = (id: string) => {
    return books.findIndex((shelf) =>
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
    let overShelfIdx = findContainer(overId);

    // Shelf 자체(빈 공간) 위에 올라갔을 때 처리
    if (overShelfIdx === -1) {
      const isShelf = overId.startsWith('shelf-');
      if (isShelf) overShelfIdx = parseInt(overId.split('-')[1]);
    }

    if (
      activeShelfIdx === -1 ||
      overShelfIdx === -1 ||
      activeShelfIdx === overShelfIdx
    )
      return;

    // 다른 Shelf로 넘어가는 순간 상태 업데이트
    setBooks((prev) => {
      const newBooks = [...prev.map((s) => [...s])];
      const activeItems = newBooks[activeShelfIdx];
      const overItems = newBooks[overShelfIdx];

      const activeIndex = activeItems.findIndex(
        (b) => b._id.toString() === activeId,
      );
      const overIndex = overItems.findIndex((b) => b._id.toString() === overId);

      let newIndex;
      if (overIndex === -1) {
        newIndex = overItems.length;
      } else {
        newIndex = overIndex;
      }

      const [item] = activeItems.splice(activeIndex, 1);
      overItems.splice(newIndex, 0, item);

      return newBooks;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // 1. 드래그 중인 아이템의 컨테이너 찾기
    const activeShelfIdx = findContainer(activeId);

    // 2. 드롭 대상이 'Shelf' 자체인지 '다른 책'인지 확인
    let overShelfIdx = findContainer(overId);

    // 만약 overId가 책 ID가 아니라 Shelf ID(예: "shelf-0")라면?
    if (overShelfIdx === -1) {
      // ID 형식이 "shelf-0" 인 경우 숫자 인덱스만 추출
      const shelfIndex = parseInt(overId.replace('shelf-', ''));
      if (!isNaN(shelfIndex)) overShelfIdx = shelfIndex;
    }

    if (activeShelfIdx === -1 || overShelfIdx === -1) return;

    // ... (이후 정렬 및 이동 로직은 동일)
    setBooks((prev) => {
      const newBooks = [...prev.map((s) => [...s])];
      const activeItems = newBooks[activeShelfIdx];
      const overItems = newBooks[overShelfIdx];

      const oldIndex = activeItems.findIndex(
        (b) => b._id.toString() === activeId,
      );

      // 만약 Shelf 자체에 던졌다면 맨 마지막으로 이동, 책 위에 던졌다면 그 위치로 이동
      const overItemIndex = overItems.findIndex(
        (b) => b._id.toString() === overId,
      );
      const newIndex = overItemIndex === -1 ? overItems.length : overItemIndex;

      if (activeShelfIdx === overShelfIdx) {
        newBooks[activeShelfIdx] = arrayMove(activeItems, oldIndex, newIndex);
      } else {
        const [movedItem] = activeItems.splice(oldIndex, 1);
        overItems.splice(newIndex, 0, movedItem);
      }
      return newBooks;
    });

    setCurrentActiveId(null);
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setBooks(() => {
        const nextBooks: LibraryType[] = [[], [], []];
        data.forEach((book, i) => {
          if (i % 2) {
            book.shelf = 0;
            nextBooks[0].push(book);
          } else {
            book.shelf = 1;
            nextBooks[1].push(book);
          }
        });
        return nextBooks;
      });
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-6xl">
      {!isLoading && books && books.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col">
            {books.map((shelf, idx) => (
              <Shelf key={`shelf-${idx}`} id={`shelf-${idx}`}>
                <SortableContext
                  items={shelf.map((b) => b._id.toString())}
                  strategy={rectSortingStrategy}
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
            {currentActiveId ? (
              // 현재 드래그 중인 책의 정보를 찾아 렌더링
              <BookSpine
                book={
                  books
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
