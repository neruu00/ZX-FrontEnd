'use client';

import { Check, Pause, Play, X } from 'lucide-react';
import { useRouter as useNavigation, useParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import MemoForm from './_components/MemoForm';
import ReadingTimer from './_components/ReadingTimer';

export default function BookFlowPage() {
  const { isbn13 } = useParams<{ isbn13: string }>();
  const router = useNavigation();
  const [isStop, setIsStop] = useState(false);

  const onClickStop = () => setIsStop((prev) => !prev);

  //TODO - 독서 중 사용자 상호작용이 없을 때 페이지 전체에 overlay를 렌더링 해 방해 금지 모드 실행

  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      <ReadingTimer isStop={isStop} />
      <div className="bg-primary-foreground fixed bottom-0 left-0 z-10 flex w-dvw justify-between p-4">
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <X size={16} />
            <span>나가기</span>
          </Button>
          <Button variant="secondary" onClick={onClickStop}>
            {isStop ? (
              <>
                <Play size={16} />
                <span>계속읽기</span>
              </>
            ) : (
              <>
                <Pause size={16} />
                <span>일시정지</span>
              </>
            )}
          </Button>
          <Button variant="secondary" onClick={() => alert('구현 예정')}>
            <Check size={16} />
            <span>독서 완료</span>
          </Button>
        </div>
        <MemoForm isbn13={isbn13} />
      </div>
    </div>
  );
}
