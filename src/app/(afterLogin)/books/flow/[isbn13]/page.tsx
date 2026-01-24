'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { notFound, useParams } from 'next/navigation';
import YouTube from 'react-youtube';
import MemoSidebar from './_components/MemoSidebar';
import { useModalStore } from '@/stores/useModalStore';
import BookmarkModal from './_components/BookmarkModal';
import Validator from '@/lib/Validator';
import YouTubeInputField from './_components/YouTubeInputField';
import YouTubePlayer from './_components/YouTubePlayer';

interface MediaState {
  input: string;
  embedUrl: string | null;
}

export default function BookFlowPage() {
  const { isbn13 } = useParams() as { isbn13?: string };
  const { isOpen, modal, setModal, open } = useModalStore();

  const [mediaState, setMediaState] = useState<MediaState>({
    input: '',
    embedUrl: '',
  });

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);

  const STORAGE_KEY = 'dokhu-book-flow-storage';

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleMediaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setMediaState((prev) => ({
      ...prev,
      input: url,
    }));

    const youtubeId = new Validator(url).extractYoutubeId();
    if (youtubeId) {
      setMediaState({
        input: '',
        embedUrl: youtubeId,
      });
    }
  };

  const clearMedia = () => {
    setMediaState({
      input: '',
      embedUrl: null,
    });
  };

  useEffect(() => {
    if (!isbn13) return;

    const isISBN13 = new Validator(isbn13).isISBN13().isValid();
    if (isISBN13) setModal(<BookmarkModal isbn13={isbn13} />);
    else return notFound();

    const loadTimerData = localStorage.getItem(STORAGE_KEY);
    if (loadTimerData) {
      const timerData = JSON.parse(loadTimerData);
      if (timerData.isbn13 === isbn13) {
        setIsTimerPaused(false);
        setElapsedTime(timerData.elapsedTime);
      }
    }
  }, [isbn13]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isTimerPaused) {
      const start = Date.now() - elapsedTime * 1000;
      setStartTime(start);

      const updateTimer = () => {
        const now = Date.now();
        const newElapsed = Math.floor((now - start) / 1000);
        setElapsedTime(newElapsed);
      };

      interval = setInterval(updateTimer, 100);
    }

    return () => clearInterval(interval);
  }, [isTimerPaused]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        isbn13,
        elapsedTime,
        isPaused: isTimerPaused,
        lastActiveTime: Date.now(),
      }),
    );
  }, [elapsedTime, isTimerPaused, isbn13]);

  return (
    <>
      {isbn13 && <MemoSidebar isbn13={isbn13} />}
      {isOpen && modal}

      <div className="fixed inset-0 flex flex-col overflow-hidden bg-black font-mono">
        {/* SECTION - header */}
        <div className="bg flex items-center justify-end px-8 py-6">
          <div className="flex items-center gap-4">
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
                /* Media Mode */
                <motion.div
                  key="media-mode"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex w-full flex-col items-center gap-8"
                >
                  <YouTubePlayer embedUrl={mediaState.embedUrl} />

                  {/* Timer Small & Controls */}
                  <div className="flex flex-col items-center gap-6">
                    <div className="text-zinc-400' font-mono text-3xl tracking-tight tabular-nums">
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
                /* Timer Mode */
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
                    <div className="mt-4 text-sm tracking-[0.2em] text-zinc-600 uppercase">
                      Current Session
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <button
                      onClick={() => setIsTimerPaused(!isTimerPaused)}
                      className="group flex flex-col items-center gap-3 text-zinc-400 transition-colors hover:text-orange-500"
                    >
                      <div className="group-hover:border-orange-500' rounded-full border-2 border-zinc-800 p-4 transition-all group-active:scale-95">
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
