'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Music, Link as LinkIcon, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import YouTube from 'react-youtube';
import { useParams } from 'next/navigation';
import MemoSidebar from './_components/MemoSidebar';
import { useModalStore } from '@/stores/useModalStore';
import BookmarkModal from './_components/BookmarkModal';

export default function BookFlowPage() {
  const { isbn13 } = useParams() as { isbn13?: string };

  // Media state
  const [mediaInput, setMediaInput] = useState('');
  const [mediaEmbedUrl, setMediaEmbedUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'youtube' | null>(null);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const { isOpen, modal, setModal, open } = useModalStore();

  useEffect(() => {
    if (isbn13) setModal(<BookmarkModal isbn13={isbn13} />);
    else setModal(null);
  }, [isbn13]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isTimerPaused) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerPaused, setElapsedTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMediaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setMediaInput(url);

    const youtubeRegExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

    const youtubeMatch = url.match(youtubeRegExp);

    if (youtubeMatch && youtubeMatch[2].length === 11) {
      setMediaEmbedUrl(youtubeMatch[2]);
      setMediaType('youtube');
      setMediaInput('');
    }
  };

  const clearMedia = () => {
    setMediaEmbedUrl(null);
    setMediaInput('');
    setMediaType(null);
  };
  // !SECTION - Timer state & logic

  return (
    <>
      {isbn13 && <MemoSidebar isbn13={isbn13} />}
      {isOpen && modal}

      <div
        className={`fixed inset-0 flex flex-col overflow-hidden bg-black font-mono`}
      >
        {/* SECTION - header */}
        <div className={`bg flex items-center justify-end px-8 py-6`}>
          <div className="flex items-center gap-4">
            <button
              onClick={open}
              className={`text-zinc-600 transition-colors hover:text-zinc-100`}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        {/* !SECTION - header */}

        {/* SECTION - content */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden transition-all duration-300">
          <div
            className={`flex w-full max-w-4xl flex-col items-center gap-12 px-12 transition-all duration-300`}
          >
            <AnimatePresence mode="wait">
              {mediaEmbedUrl ? (
                /* Media Mode */
                <motion.div
                  key="media-mode"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex w-full flex-col items-center gap-8"
                >
                  {/* Video Player */}
                  <div
                    className={`group relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900 shadow-2xl`}
                  >
                    {mediaType === 'youtube' ? (
                      <YouTube
                        videoId={mediaEmbedUrl}
                        opts={{
                          height: '100%',
                          width: '100%',
                          playerVars: {
                            autoplay: 1,
                            controls: 1,
                            loop: 1,
                            playlist: mediaEmbedUrl,
                            modestbranding: 1,
                            rel: 0,
                          },
                        }}
                        className="h-full w-full"
                        iframeClassName="w-full h-full"
                      />
                    ) : (
                      <iframe
                        src={mediaEmbedUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        title="Media"
                        className="h-full w-full"
                      ></iframe>
                    )}
                    <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
                  </div>

                  {/* Timer Small & Controls */}
                  <div className="flex flex-col items-center gap-6">
                    <div
                      className={`text-zinc-400' font-mono text-3xl tracking-tight tabular-nums`}
                    >
                      {formatTime(elapsedTime)}
                    </div>

                    <div className="flex items-center gap-8">
                      <button
                        onClick={() => setIsTimerPaused(!isTimerPaused)}
                        className={`group flex items-center gap-3 text-zinc-400 transition-colors hover:text-orange-500`}
                      >
                        <div
                          className={`$border-zinc-800 rounded-full border bg-zinc-900 p-3 transition-all group-hover:border-orange-500 group-active:scale-95`}
                        >
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
                    <div
                      className={`font-mono text-9xl tracking-tighter text-zinc-100 tabular-nums`}
                    >
                      {formatTime(elapsedTime)}
                    </div>
                    <div
                      className={`mt-4 text-sm tracking-[0.2em] text-zinc-600 uppercase`}
                    >
                      Current Session
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <button
                      onClick={() => setIsTimerPaused(!isTimerPaused)}
                      className={`group flex flex-col items-center gap-3 text-zinc-400 transition-colors hover:text-orange-500`}
                    >
                      <div
                        className={`group-hover:border-orange-500' rounded-full border-2 border-zinc-800 p-4 transition-all group-active:scale-95`}
                      >
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

          {/* Bottom Media Input */}
          <div className="relative flex max-h-14 w-120 flex-1 items-center justify-center">
            {mediaEmbedUrl ? (
              <div className="bg-opacity-10 group flex h-full w-full items-center justify-between gap-4 rounded-full border border-zinc-700 bg-zinc-900 px-6 transition-colors hover:border-orange-500/50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Youtube size={16} className="shrink-0" />
                  <span className="truncate text-sm text-zinc-300">
                    Playing Youtube...
                  </span>
                </div>
                <button
                  onClick={clearMedia}
                  className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="group relative w-full">
                <div
                  className={`text-zinc-600' : 'text-zinc-400' } pointer-events-none absolute inset-y-0 left-4 flex items-center`}
                >
                  <LinkIcon size={16} />
                </div>
                <input
                  type="text"
                  value={mediaInput}
                  onChange={handleMediaInputChange}
                  className={`h-14 w-full rounded-full border border-zinc-800 bg-transparent bg-zinc-900/50 py-3 pr-12 pl-12 text-sm text-zinc-300 placeholder-zinc-700 shadow-sm transition-all outline-none hover:border-zinc-700 focus:border-orange-500`}
                  placeholder="Paste YouTube URL..."
                />
                <div
                  className={`pointer-events-none absolute top-1/2 right-5 flex -translate-y-1/2 gap-3 transition-opacity ${
                    mediaInput ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <Music size={16} className={'text-zinc-700'} />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* !SECTION - content */}
      </div>
    </>
  );
}
