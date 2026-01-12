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
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Dropcursor, Gapcursor, Placeholder } from '@tiptap/extensions';
import { Content, Editor, useEditor } from '@tiptap/react';
import { useEffect, useState } from 'react';

interface Props {
  content?: Content;
}

interface Return {
  editor: Editor | null;
}

const useTextEditor = ({ content = null }: Props): Return => {
  // tiptap은 외부 라이브러리이기 때문에 강제 리렌더링을 위해 사용
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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
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
          'prose prose-gray lg:prose-xl dark:prose-invert min-h-[80vh] focus:outline-none focus-visible:outline-none',
      },
    },
  });

  // 데이터베이스의 데이터와 동기화
  useEffect(() => {
    // 초기값만 설정하도록 함
    // NOTE - 차후 실시간 동기화 혹은 임시저장 및 데이터 업데이트에 문제가 생길 수 editor.isEmpty 제거
    if (editor && content && editor.isEmpty) {
      const currentContent = editor.getJSON();
      const isSame = currentContent === content;
      if (!isSame) editor.commands.setContent(content);
    }
  }, [content, editor]);

  return { editor };
};

export default useTextEditor;
