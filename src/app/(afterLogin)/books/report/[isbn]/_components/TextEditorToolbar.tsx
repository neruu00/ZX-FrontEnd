'use client';

import { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  ItalicIcon,
  List,
  ListOrdered,
  Quote,
  Rows,
  Strikethrough,
  UnderlineIcon,
} from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Props {
  editor: Editor | null;
}

const styleActive = 'font-bold text-brand';

export default function TextEditorToolbar({ editor }: Props) {
  const addImage = useCallback(() => {
    const url = window.prompt('URL');

    if (editor && url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <>
      <div className="toolbar fixed top-0 right-0 left-0 z-10 flex h-11 items-center gap-4 border-b border-zinc-800 bg-zinc-950 px-4 py-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive('heading', { level: 1 }) ? styleActive : ''
          }
        >
          <Heading1 />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive('heading', { level: 2 }) ? styleActive : ''
          }
        >
          <Heading2 />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive('heading', { level: 3 }) ? styleActive : ''
          }
        >
          <Heading3 />
        </Button>

        <Separator orientation="vertical" />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? styleActive : ''}
        >
          <BoldIcon />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? styleActive : ''}
        >
          <ItalicIcon />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? styleActive : ''}
        >
          <Strikethrough />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? styleActive : ''}
        >
          <UnderlineIcon />
        </Button>

        <Separator orientation="vertical" />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={
            editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''
          }
        >
          <AlignJustify />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        >
          <AlignLeft />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={
            editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''
          }
        >
          <AlignCenter />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
        >
          <AlignRight />
        </Button>

        <Separator orientation="vertical" />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? styleActive : ''}
        >
          <List />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? styleActive : ''}
        >
          <ListOrdered />
        </Button>

        <Separator orientation="vertical" />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? styleActive : ''}
        >
          <Quote size={16} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Rows size={20} />
        </Button>
        <Button size="icon" variant="ghost" onClick={addImage}>
          <ImageIcon />
        </Button>
      </div>
    </>
  );
}
