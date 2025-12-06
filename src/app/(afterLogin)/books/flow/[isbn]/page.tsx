import SevenSegmentClock from '@/components/SevenSegmentClock';
import { Button } from '@/components/ui/button';
import { Check, Pause, X } from 'lucide-react';
import IdeaRecord from './components/IdeaRecord';

export default function BookFlowPage() {
  return (
    <div className="mx-auto flex h-dvh w-dvw items-center justify-center p-6">
      <SevenSegmentClock activeColor="#EF5416" inactiveColor="#27150F" />
      <div className="bg-primary-foreground fixed bottom-0 left-0 z-10 flex w-dvw justify-between p-4">
        <div className="flex gap-4">
          <Button variant="secondary">
            <X size={16} />
            <span>나가기</span>
          </Button>
          <Button variant="secondary">
            <Pause size={16} />
            <span>일시정지</span>
          </Button>
          <Button variant="secondary">
            <Check size={16} />
            <span>독서 완료</span>
          </Button>
        </div>
        <IdeaRecord />
      </div>
    </div>
  );
}
