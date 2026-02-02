import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tooltip } from '@radix-ui/react-tooltip';
import { useRouter } from 'next/navigation';

import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BookInLibraryType } from '@/services/library.api';

import useBookAttributes from '../_hooks/useBookAttributes';

interface Props {
  book: BookInLibraryType;
  isOverlay?: boolean;
  disabled?: boolean;
}

export default function BookSpine({ book, isOverlay = false }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: book._id.toString(), disabled: book.isPlaceholder });
  const { status, bgColor, textColor } = useBookAttributes(book);
  const router = useRouter();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: book.isPlaceholder ? 0 : isDragging ? 0.3 : 1,
  };

  if (book.isPlaceholder) {
    return (
      <div
        aria-placeholder={book._id.toString()}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={cn('pointer-events-none', 'h-60.5 w-px')}
      />
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={setNodeRef}
            style={{ ...style, backgroundColor: bgColor, color: textColor }}
            {...attributes}
            {...listeners}
            className={cn(
              'relative flex h-60.5 w-15 cursor-grab flex-col items-center justify-center rounded-xs border-l border-white/10 shadow-sm active:cursor-grabbing',
              'transition-all duration-200 ease-out',
              'hover:-translate-y-2 hover:shadow-md hover:brightness-110',
              isDragging && 'z-50 opacity-70 shadow-xl',
              isOverlay ? 'cursor-grabbing' : 'cursor-grab',
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

        <TooltipContent side="top" className="w-80">
          <div className="truncate text-sm font-bold">{book.title}</div>
          <div className="mb-2 text-xs text-slate-700">{book.author}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
