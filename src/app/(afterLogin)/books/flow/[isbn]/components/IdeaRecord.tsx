'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageSquare, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type DataType = {
  id: string;
  value: string;
  createdAt: Date;
};

export default function IdeaRecord() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [data, setData] = useState<DataType[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const _value = e.target.value;
    setValue(_value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValue('');
    const _next = { id: Date.now().toString(), value, createdAt: new Date() };
    setData((prev) => [...prev, _next]);
  };

  useEffect(() => {
    //TODO - data fetch
  }, []);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen((prev) => !prev)}>
        <MessageSquare size={16} />
        <span>생각 기록</span>
      </Button>
      {open && <div className="fixed top-0 left-0 z-20 h-dvh w-dvw bg-black/40" />}
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
          {data.map((item) => (
            <div key={item.id} className="bg-muted rounded-xl p-4">
              <div className="text-xl">{item.value}</div>
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
            value={value}
            onChange={onChange}
          />
          <div className="flex justify-end">
            <Button variant="default" type="submit">
              저장
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
