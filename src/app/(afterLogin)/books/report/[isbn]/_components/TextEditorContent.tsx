'use client';

import { Editor, EditorContent } from '@tiptap/react';

interface Props {
  title?: string;
  onChangeTitle?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editor: Editor | null;
}

export default function TextEditorContent({
  title,
  onChangeTitle,
  editor,
}: Props) {
  return (
    <div className="mx-auto my-12 w-[80vw] max-w-[920px] bg-[#1e1e1e] text-zinc-100 shadow-xl shadow-black/50">
      <div className="flex min-h-[20vh] items-center justify-center">
        <input
          className="w-full text-center text-4xl focus-within:placeholder:text-black/0 focus-visible:outline-none"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={onChangeTitle}
        />
      </div>
      <EditorContent editor={editor} className="px-12" />
    </div>
  );
}
