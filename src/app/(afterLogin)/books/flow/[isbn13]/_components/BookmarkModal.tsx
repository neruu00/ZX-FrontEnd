import { motion } from 'motion/react';
import { useState } from 'react';

import { useModalStore } from '@/stores/useModalStore';

interface Props {
  isbn13: string;
}

export default function BookmarkModal({ isbn13 }: Props) {
  const [pageInput, setPageInput] = useState('');
  const { close } = useModalStore();

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-[400px] border border-zinc-800 bg-zinc-950 p-8`}
      >
        <h3
          className={`mb-6 text-center text-sm tracking-wider text-zinc-400 uppercase`}
        >
          마지막 페이지 입력
        </h3>

        <input
          type="number"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter'}
          className={`mb-6 w-full border border-zinc-800 bg-transparent px-4 py-3 text-center text-2xl text-zinc-100 placeholder-zinc-800 transition-colors outline-none focus:border-orange-500`}
          placeholder="000"
          autoFocus
        />

        <div className="flex gap-3">
          <button
            onClick={close}
            className={`flex-1 py-3 text-xs tracking-wider text-zinc-600 uppercase transition-colors hover:text-zinc-400`}
          >
            취소
          </button>
          <button
            onClick={() => {}}
            className="flex-1 border border-orange-500 bg-orange-500 py-3 text-xs font-bold tracking-wider text-black uppercase transition-colors hover:bg-orange-600"
          >
            저장
          </button>
        </div>
      </motion.div>
    </div>
  );
}
