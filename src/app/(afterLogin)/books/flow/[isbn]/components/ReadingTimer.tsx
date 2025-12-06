'use client';

import { useEffect, useState } from 'react';

import SevenSegmentClock from '@/components/SevenSegmentClock';

interface Props {
  isStop?: boolean;
}

export default function ReadingTimer({ isStop }: Props) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isStop) setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isStop]);

  //TODO - 일시 정지 상태일 때 active Color 색상 진하게 변경
  return (
    <SevenSegmentClock
      hour={Math.floor(time / 3600)}
      minute={Math.floor((time % 3600) / 60)}
      seconds={Math.floor(time % 60)}
      activeColor="#EF5416"
      inactiveColor="#27150F"
    />
  );
}
