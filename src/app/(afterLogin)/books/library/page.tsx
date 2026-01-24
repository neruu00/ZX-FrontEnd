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
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import PageContainer from '@/components/PageContainer';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  BookInLibraryType,
  getLibraryList,
  LibraryType,
} from '@/services/library.api';
import { useRouter } from 'next/navigation';

// --- [Logic] 색상 밝기 계산 및 텍스트 색상 결정 ---
function getContrastColor(hexColor: string) {
  // 1. Hex -> RGB 변환
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // 2. 밝기(Luminance) 계산 공식
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // 3. 밝으면 검은 글씨, 어두우면 흰 글씨 (기준값 128)
  return yiq >= 128 ? '#1e293b' : '#f8fafc'; // slate-800 or slate-50
}

// --- [Logic] 문자열 기반 색상 생성 (이미지 추출 실패 시 Fallback) ---
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

// --- [Hook] 책 속성 계산 (색상 추출 + 상태 기본값) ---
function useBookAttributes(book: BookInLibraryType) {
  const [extractedColor, setExtractedColor] = useState<string | null>(null);

  // 1. 상태(Status) 처리: 없으면 'PENDING'
  const finalStatus = book.status || 'PENDING';

  // 2. 색상(Color) 처리 로직
  useEffect(() => {
    // 이미 지정된 색상이 있다면 추출하지 않음
    if (book.spineColor) {
      setExtractedColor(book.spineColor);
      return;
    }

    // 이미지에서 색상 추출 시도 (Canvas 활용)
    const img = new Image();
    img.src = book.cover;
    img.crossOrigin = 'Anonymous'; // 중요: CORS 허용

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          // RGB -> Hex 변환
          const hex =
            '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
          setExtractedColor(hex);
        }
      } catch (e) {
        // CORS 에러 등으로 캔버스 접근 불가 시, 제목 해시값으로 대체
        console.warn(
          `Cannot extract color from image (CORS likely): ${book.title}`,
        );
        setExtractedColor(stringToColor(book.title));
      }
    };

    img.onerror = () => {
      // 이미지 로드 실패 시에도 제목 해시값 사용
      setExtractedColor(stringToColor(book.title));
    };
  }, [book.cover, book.spineColor, book.title]);

  // 최종 배경색 (로딩 중이거나 계산 전이면 기본 회색)
  const bgColor = extractedColor || '#64748b';

  // 텍스트 색상 계산
  const textColor = getContrastColor(bgColor);

  return { status: finalStatus, bgColor, textColor };
}

// --- 3. 책등(Spine) 컴포넌트 ---
function BookSpine({ book }: { book: BookInLibraryType }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: book._id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  // ★ 커스텀 훅을 통해 계산된 속성 가져오기
  const { status, bgColor, textColor } = useBookAttributes(book);
  const router = useRouter();

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={setNodeRef}
            // 배경색과 텍스트 색상을 동적으로 적용
            style={{ ...style, backgroundColor: bgColor, color: textColor }}
            {...attributes}
            {...listeners}
            className={cn(
              'relative flex h-55 w-10 cursor-grab flex-col items-center justify-center rounded-xs border-l border-white/10 shadow-sm active:cursor-grabbing',
              'transition-all duration-200 ease-out',
              'hover:-translate-y-2 hover:shadow-md hover:brightness-110',
              isDragging && 'z-50 scale-105 opacity-70 shadow-xl',
            )}
            onClick={() => router.push(`/books/${book.isbn13}`)}
          >
            <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-white/10" />

            <div
              className="text-center text-sm font-medium"
              style={{
                writingMode: 'sideways-rl',
              }}
            >
              <span className="line-clamp-1 h-50 truncate leading-none tracking-tight">
                {book.title.split('-')[0]}
              </span>
            </div>
          </button>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          className="w-80 border-slate-700 bg-slate-900 text-slate-200"
        >
          <div className="truncate text-sm font-bold">{book.title}</div>
          <div className="mb-2 text-xs text-slate-400">{book.author}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// --- 4. 메인 서재 페이지 (필터링 로직 수정) ---
export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<string>('ALL');

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

  const tabs = [
    { label: '전체', value: 'ALL' },
    { label: '읽는중', value: 'READING' },
    { label: '읽을예정', value: 'WISH' },
    { label: '완독', value: 'COMPLETED' },
  ];

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <PageContainer as="div">
      <header className="mx-auto mb-8 flex max-w-6xl items-center justify-between">
        <h1 className="bg-clip-text text-3xl font-bold">My Shelf</h1>
        <div className="flex items-center gap-6">
          <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'rounded-md px-4 py-1.5 text-sm transition-all',
                  activeTab === tab.value
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl">
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
      </main>
    </PageContainer>
  );
}
