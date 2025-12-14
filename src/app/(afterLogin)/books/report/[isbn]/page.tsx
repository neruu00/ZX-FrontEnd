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
import {
  getBookReport,
  postBookReport,
  updateBookReport,
} from '@/services/report.api';

type DateType = {
  _id: ObjectId;
  isbn: string;
  content: Content;
  createdAt: string;
  updatedAt: string;
} | null;

export default function BookReportPage() {
  const { isbn } = useParams() as { isbn?: string };
  const [data, setData] = useState<DateType>(null);
  const { editor } = useTextEditor({ content: data?.content || null });
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    console.log(e.target.value);
  };

  const saveReport = async () => {
    if (!editor || !isbn) return;
    if (confirm('저장하시겠습니까?') === false) return;

    if (title.trim() === '') {
      alert('제목을 입력해주세요.');
      return;
    }

    const content = editor.getJSON();

    try {
      const resGET = await getBookReport({ isbn });
      const isSaved = resGET ? true : false;
      const body = { isbn, title, content };

      if (isSaved) await updateBookReport(body);
      else await postBookReport(body);

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
        const res = await getBookReport({ isbn: isbn as string });
        setData(res);
        setTitle(res?.title || '');
      } catch (error) {
        alert(error);
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
            onClick={saveReport}
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
