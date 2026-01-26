'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Play, Pause, Save } from 'lucide-react'; // Save 아이콘 추가
import { motion, AnimatePresence } from 'motion/react';
import { notFound, useParams } from 'next/navigation';
import MemoSidebar from './_components/MemoSidebar';
import { useModalStore } from '@/stores/useModalStore';
import BookmarkModal from './_components/BookmarkModal';
import Validator from '@/lib/Validator';
import YouTubeInputField from './_components/YouTubeInputField';
import YouTubePlayer from './_components/YouTubePlayer';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrCreateFlow, updateFlow } from '@/services/flow.api';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'; // 로딩 아이콘

const STORAGE_KEY = 'dokhu-book-flow-storage';

interface MediaState {
  input: string;
  embedUrl: string | null;
}

interface LocalTimerData {
  isbn13: string;
  elapsedTime: number;
  isPaused: boolean;
  lastActiveTime: number;
  isSynced: boolean;
}

export default function BookFlowPage() {
  const { isbn13 } = useParams() as { isbn13?: string };
  const { isOpen, modal, setModal, open } = useModalStore();
  const queryClient = useQueryClient();

  const [mediaState, setMediaState] = useState<MediaState>({
    input: '',
    embedUrl: '',
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(true);

  const isLocalDirty = useRef(false);

  const { data } = useQuery({
    queryKey: ['flow', isbn13],
    queryFn: async () => getOrCreateFlow({ isbn13: isbn13 as string }),
    staleTime: 0,
    enabled: !!isbn13,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!data) throw new Error('데이터가 로드되지 않았습니다.');
      const _id = data._id.toString();
      return updateFlow({ _id, elapsedTime });
    },
    onSuccess: () => {
      setIsTimerPaused(true);
      isLocalDirty.current = false;
      saveToLocalStorage(elapsedTime, isTimerPaused, true);
      queryClient.invalidateQueries({ queryKey: ['flow', isbn13] });
      alert('저장 성공');
    },
    onError: (error) => {
      isLocalDirty.current = true;
      saveToLocalStorage(elapsedTime, isTimerPaused, false);
    },
  });

  // --- 3. LocalStorage Helper ---
  const saveToLocalStorage = useCallback(
    (time: number, paused: boolean, synced: boolean) => {
      if (!isbn13) return;
      const data: LocalTimerData = {
        isbn13,
        elapsedTime: time,
        isPaused: paused,
        lastActiveTime: Date.now(),
        isSynced: synced,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    [isbn13],
  );

  // --- 4. Initial Load Logic ---
  useEffect(() => {
    if (!isbn13) return;

    // URL 유효성 검사
    const isISBN13 = new Validator(isbn13).isISBN13().isValid();
    if (isISBN13) setModal(<BookmarkModal isbn13={isbn13} />);
    else return notFound();
  }, [isbn13, setModal]);

  // 데이터 동기화 로직 (로컬 vs 서버)
  useEffect(() => {
    if (!isbn13) return;

    const localStr = localStorage.getItem(STORAGE_KEY);
    let localData: LocalTimerData | null = null;

    if (localStr) {
      const parsed = JSON.parse(localStr);
      if (parsed.isbn13 === isbn13) {
        localData = parsed;
      }
    }

    // 우선순위 결정: 저장 안 된 로컬 데이터 > 서버 데이터 > 저장 된 로컬 데이터
    if (localData && !localData.isSynced) {
      // 로컬에 '저장 버튼 안 누른' 기록이 있으면 그거 복구
      setElapsedTime(localData.elapsedTime);
      isLocalDirty.current = true;
    } else if (data) {
      // 로컬이 깨끗하면 서버 데이터 사용
      setElapsedTime(data.elapsedTime);
      isLocalDirty.current = false;
      saveToLocalStorage(data.elapsedTime, true, true);
    } else if (localData) {
      // 서버 로딩 중이면 로컬 데이터 임시 표시
      setElapsedTime(localData.elapsedTime);
    }
  }, [data, isbn13, saveToLocalStorage]);

  // --- 5. Timer Logic ---
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isTimerPaused) {
      // 타이머가 돌기 시작하면 '수정됨(Dirty)' 상태
      isLocalDirty.current = true;
      const start = Date.now() - elapsedTime * 1000;

      interval = setInterval(() => {
        const now = Date.now();
        const newElapsed = Math.floor((now - start) / 1000);
        setElapsedTime(newElapsed);

        // ★ 중요: 0.1초마다 로컬 스토리지 백업 (서버 요청 X)
        // isSynced: false -> 아직 저장 버튼 안 눌렀음 표시
        saveToLocalStorage(newElapsed, false, false);
      }, 100);
    } else {
      // 일시정지 시에도 현재 상태 로컬 백업
      saveToLocalStorage(
        elapsedTime,
        true,
        isLocalDirty.current ? false : true,
      );
    }
    return () => clearInterval(interval);
  }, [isTimerPaused, elapsedTime, saveToLocalStorage]);

  // --- Helper Functions ---
  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleMediaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setMediaState((prev) => ({ ...prev, input: url }));
    const youtubeId = new Validator(url).extractYoutubeId();
    if (youtubeId) setMediaState({ input: '', embedUrl: youtubeId });
  };

  const clearMedia = () => setMediaState({ input: '', embedUrl: null });

  return (
    <>
      {isbn13 && <MemoSidebar isbn13={isbn13} />}
      {isOpen && modal}

      <div className="fixed inset-0 flex flex-col overflow-hidden bg-black font-mono">
        {/* SECTION - header */}
        <div className="bg flex items-center justify-end px-8 py-6">
          <div className="flex items-center gap-4">
            {/* ★ 저장 버튼 (Manual Save) */}
            <Button
              onClick={() => mutate()}
              disabled={isPending || !data} // 로딩 중이거나 데이터 없을 때 비활성화
              className="flex items-center gap-2 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>저장</span>
                </>
              )}
            </Button>

            <button
              onClick={open}
              className="text-zinc-600 transition-colors hover:text-zinc-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        {/* !SECTION - header */}

        {/* SECTION - content */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden transition-all duration-300">
          <div className="flex w-full max-w-4xl flex-col items-center gap-12 px-12 transition-all duration-300">
            <AnimatePresence mode="wait">
              {mediaState.embedUrl ? (
                <motion.div
                  key="media-mode"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex w-full flex-col items-center gap-8"
                >
                  <YouTubePlayer embedUrl={mediaState.embedUrl} />

                  <div className="flex flex-col items-center gap-6">
                    <div className="font-mono text-3xl tracking-tight text-zinc-400 tabular-nums">
                      {formatTime(elapsedTime)}
                    </div>

                    <div className="flex items-center gap-8">
                      <button
                        onClick={() => setIsTimerPaused(!isTimerPaused)}
                        className="group flex items-center gap-3 text-zinc-400 transition-colors hover:text-orange-500"
                      >
                        <div className="rounded-full border border-zinc-800 bg-zinc-900 p-3 transition-all group-hover:border-orange-500 group-active:scale-95">
                          {isTimerPaused ? (
                            <Play size={20} fill="currentColor" />
                          ) : (
                            <Pause size={20} fill="currentColor" />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="timer-mode"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-12"
                >
                  <div className="flex flex-col items-center">
                    <div className="font-mono text-9xl tracking-tighter text-zinc-100 tabular-nums">
                      {formatTime(elapsedTime)}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm tracking-[0.2em] text-zinc-600 uppercase">
                      Current Session
                      {/* 저장 안 된 상태 표시 (옵션) */}
                      {/* {isLocalDirty.current && <span className="h-2 w-2 rounded-full bg-orange-500" title="저장되지 않음"></span>} */}
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <button
                      onClick={() => setIsTimerPaused(!isTimerPaused)}
                      className="group flex flex-col items-center gap-3 text-zinc-400 transition-colors hover:text-orange-500"
                    >
                      <div className="rounded-full border-2 border-zinc-800 p-4 transition-all group-hover:border-orange-500 group-active:scale-95">
                        {isTimerPaused ? (
                          <Play size={32} fill="currentColor" />
                        ) : (
                          <Pause size={32} fill="currentColor" />
                        )}
                      </div>
                      <span className="text-xs tracking-wider uppercase">
                        {isTimerPaused ? '계속' : '일시정지'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <YouTubeInputField
            input={mediaState.input}
            embedUrl={mediaState.embedUrl}
            onChange={handleMediaInputChange}
            onClear={clearMedia}
          />
        </div>
        {/* !SECTION - content */}
      </div>
    </>
  );
}
