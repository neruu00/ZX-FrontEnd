'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getMemos, postMemo } from '@/services/memo.api';

type Data = {
  _id: string;
  userId: string;
  isbn13: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}[];

export default function MemoForm({ isbn13 }: { isbn13: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');

  const { data, isLoading } = useQuery<Data>({
    queryKey: ['memos', isbn13],
    queryFn: () => getMemos({ isbn13 }),
    enabled: open && !!isbn13,
  });

  const { mutate } = useMutation({
    mutationKey: ['create-memo'],
    mutationFn: () => postMemo({ isbn13, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memos', isbn13] });
      setContent('');
      alert('메모가 저장되었습니다.');
    },
    onError: () => {
      alert('메모 저장에 실패했습니다.');
    },
  });

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const _value = e.target.value;
    setContent(_value);
  };

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (!isbn13) {
      alert('잘못된 접근입니다.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요');
      return;
    }
    mutate();
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen((prev) => !prev)}>
        <MessageSquare size={16} />
        <span>생각 기록</span>
      </Button>
      {open && (
        <div className="fixed top-0 left-0 z-20 h-dvh w-dvw bg-black/40" />
      )}
      <div
        className={cn([
          'fixed top-0 right-0 z-30',
          'h-dvh w-[580px] p-4',
          'flex flex-col gap-4',
          'bg-primary-foreground',
          'translate-x-[580px] transition-all duration-300',
          open && 'translate-x-0',
        ])}
      >
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setOpen((prev) => !prev)}
        >
          <X />
        </Button>

        <div className="flex grow flex-col gap-4 overflow-y-auto p-6">
          {!isLoading &&
            data &&
            data.map((item) => (
              <div key={item._id} className="bg-muted rounded-xl p-4">
                <div className="text-xl">{item.content}</div>
                <div className="text-muted-foreground text-sm">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
        </div>

        <form onSubmit={onSubmit}>
          <textarea
            className="bg-muted h-[180px] w-full resize-none rounded-xl border p-4"
            placeholder="기록할 생각을 입력해주세요..."
            value={content}
            onChange={onChange}
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <Button variant="default" type="submit" disabled={isLoading}>
              저장
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
