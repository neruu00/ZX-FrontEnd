'use client';

import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import { Dropcursor, Gapcursor, Placeholder } from '@tiptap/extensions';
import { useEditor, EditorContent } from '@tiptap/react';
import {
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
import { useCallback, useState } from 'react';

import { Button } from './ui/button';

interface Props {
  content?: string;
}

const styleActive = 'font-bold text-brand';

export default function TextEditor({ content }: Props) {
  const [_, forceUpdate] = useState(false);
  const editor = useEditor({
    content,
    /** NOTE
     * Don't render immediately on the server
     * to avoid SSR issues
     */
    immediatelyRender: false,
    extensions: [
      Document,
      Text,
      Paragraph,
      Heading.configure({ levels: [1, 2, 3] }),
      Blockquote,
      BulletList,
      OrderedList,
      ListItem,
      HorizontalRule,
      Image,
      Dropcursor,
      Gapcursor,
      Bold,
      Italic,
      Strike,
      Underline,
      Placeholder.configure({
        placeholder: 'Write something …',
      }),
    ],
    onTransaction: () => {
      forceUpdate((prev) => !prev);
    },
    // onSelectionUpdate: () => {
    //   forceUpdate((prev) => !prev);
    // },
    editorProps: {
      attributes: {
        class:
          'prose prose-gray lg:prose-xl dark:prose-invert border-primary min-h-[300px] max-w-none border border-t-0 p-4 focus:outline-none focus-visible:outline-none',
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('URL');

    if (editor && url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="mx-auto flex h-full w-[920px] flex-col">
      <div className="toolbar border-primary flex items-center gap-4 border">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? styleActive : ''}
        >
          <Heading1 />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? styleActive : ''}
        >
          <Heading2 />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? styleActive : ''}
        >
          <Heading3 />
        </Button>
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
      <EditorContent editor={editor} />
      <div className="flex justify-end">
        <Button
          onClick={() => {
            console.log(editor.getHTML());
            console.log(editor.getJSON());
            console.log(editor.getText());
          }}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
