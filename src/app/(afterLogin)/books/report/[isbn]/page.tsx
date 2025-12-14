'use client';

import { Content } from '@tiptap/react';
import { ArrowLeft, NotepadText, Save } from 'lucide-react';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Toolbar from '@/app/(afterLogin)/books/report/[isbn]/_components/TextEditorToolbar';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';

import TextEditorContent from './_components/TextEditorContent';
import useTextEditor from './_components/useTextEditor';

type DateType = {
  _id: ObjectId;
  isbn: string;
  content: Content;
  createdAt: string;
  updatedAt: string;
} | null;

export default function BookReportPage() {
  const { isbn } = useParams();
  const [data, setData] = useState<DateType>(null);
  const { editor } = useTextEditor({ content: data?.content || null });
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    console.log(e.target.value);
  };

  const saveRecord = async () => {
    if (!editor || !isbn) return;
    if (confirm('저장하시겠습니까?') === false) return;

    if (title.trim() === '') {
      alert('제목을 입력해주세요.');
      return;
    }

    const content = editor.getJSON();
    const url = '/api/books/report';

    try {
      const resGET = await fetch(`/api/books/report?query=${isbn}`, {
        cache: 'no-store',
      });

      if (!resGET.ok) throw new Error('Network response was not ok');

      const isSaved = (await resGET.json()) ? true : false;

      if (isSaved) {
        const resUPDATE = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isbn,
            title,
            content,
          }),
        });
        const result = resUPDATE;
        console.log('UPDATE result:', result);
      } else {
        const resPOST = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isbn,
            title,
            content,
          }),
        });
        const result = await resPOST.json();
        console.log('POST result:', result);
      }

      //TODO - response success toast
      alert('저장이 완료되었습니다.');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!isbn) return;
      try {
        setIsLoading(true);
        const response = await fetch(`/api/books/report?query=${isbn}`, {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const res = await response.json();
        setData(res);
        setTitle(res?.title || '');
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isbn]);

  if (isLoading) {
    return (
      <PageContainer className="flex h-dvh items-center justify-center">
        <span>Loading...</span>
      </PageContainer>
    );
  }

  //TODO - 임시 저장 기능 구현
  return (
    <PageContainer
      as="main"
      className="h-fit min-h-dvh w-dvw overflow-scroll bg-zinc-900"
      areaVisible={false}
    >
      {editor && (
        <>
          <Toolbar editor={editor} />
          <TextEditorContent
            title={title}
            onChangeTitle={onChangeTitle}
            editor={editor}
          />
        </>
      )}
      <div className="fixed right-0 bottom-0 left-0 z-10 flex items-center justify-between border-t bg-zinc-950 p-2">
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-1"
          asChild
        >
          <Link href={`/books/${isbn}`}>
            <ArrowLeft />
            <span>돌아가기</span>
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => alert('메모보기 기능은 곧 업데이트됩니다!')}
            className="flex items-center justify-center gap-1"
          >
            <NotepadText />
            <span>메모보기</span>
          </Button>
          <Button
            variant="highlight"
            onClick={saveRecord}
            className="flex items-center justify-center gap-1"
          >
            <Save />
            <span>저장하기</span>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
