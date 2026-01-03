'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';

interface Props {
  placeholder?: string;
}

export default function SearchField({ placeholder = '' }: Props) {
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debouncedKeyword = useDebounce(keyword);

  const {} = useQuery({
    queryKey: ['search', debouncedKeyword],
    queryFn: () => {
      return keyword;
    },
    enabled: !!debouncedKeyword,
    staleTime: 5 * 60 * 1000,
  });

  const handleFocus = () => {
    if (keyword) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const nextKeyword = e.target.value;
    setKeyword(nextKeyword);
    if (!nextKeyword) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-4/5" ref={wrapperRef}>
      <div
        className={cn([
          'group/search flex items-center gap-4',
          'bg-background-primary w-full px-4 py-2',
          'border-border-secondary rounded-full border',
          'outline-border-brand-tertiary',
          'hover:bg-background-primary-hover',
          'focus-within:border-border-brand-tertiary focus-within:outline',
          'transition-all',
        ])}
      >
        <label htmlFor="search">
          <SearchIcon
            className="stroke-icon-primary group-focus-within/search:stroke-icon-brand-secondary"
            size={18}
          />
        </label>
        <input
          id="search"
          className={cn([
            'w-full',
            'text-text-neutral-tertiary',
            'hover:placeholder:text-text-tertiary',
            'focus-visible:outline-0 focus-visible:placeholder:opacity-0',
          ])}
          value={keyword}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
        />
      </div>
      {isOpen ? (
        <div
          className={cn([
            'absolute z-10',
            'min-h-80 w-full',
            'bg-background-primary rounded-2xl',
            `translate-y-1`,
          ])}
        />
      ) : null}
    </div>
  );
}
