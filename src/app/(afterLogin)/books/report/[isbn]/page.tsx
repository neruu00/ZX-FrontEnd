'use client';

import { Save } from 'lucide-react';

import Toolbar from '@/app/(afterLogin)/books/report/[isbn]/_components/TextEditorToolbar';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';

import TextEditorContent from './_components/TextEditorContent';
import useTextEditor from './_components/useTextEditor';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Content } from '@tiptap/react';
import { ObjectId } from 'mongodb';

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

  const saveRecord = async () => {
    if (!editor || !isbn) return;
    if (confirm('저장하시겠습니까?') === false) return;

    const content = editor.getJSON();
    const url = '/api/books/report';

    try {
      const resGET = await fetch(`/api/books/report?query=${isbn}`, {
        cache: 'no-store',
      });

      if (!resGET.ok) throw new Error('Network response was not ok');

      console.log(resGET);

      if (resGET) {
        const resUPDATE = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isbn,
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
      console.log('fetching data for isbn:', isbn);
      try {
        setIsLoading(true);
        const response = await fetch(`/api/books/report?query=${isbn}`, {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const res = await response.json();
        console.table(res);
        setData(res);
        console.log('fetched data:', res);
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
    <PageContainer className="h-dvh">
      <div className="bg-black">
        {editor && (
          <>
            <Toolbar editor={editor} />
            <TextEditorContent editor={editor} />
          </>
        )}
        <div className="bg-primary-foreground fixed right-0 bottom-0 left-0 flex p-2">
          <Button
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
