import SevenSegmentClock from '@/components/SevenSegmentClock';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export default function BookFlowPage() {
  return (
    <div className="mx-auto w-[920px] p-6">
      <h1>Book Flow Page</h1>
      <div className="mx-auto my-6">
        <SevenSegmentClock activeColor="#EF5416" inactiveColor="#27150F" />
      </div>
      <div className="bg-primary-foreground fixed bottom-0 left-0 z-10 flex w-dvw justify-between p-4">
        <div>
          <Button variant="secondary">a</Button>
          <Button variant="secondary">b</Button>
          <Button variant="secondary">c</Button>
        </div>
        <Button variant="secondary">
          <MessageSquare size={16} />
          <span>생각 기록</span>
        </Button>
      </div>
    </div>
  );
}
