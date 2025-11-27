import BookMark from '@/components/BookMark';
import SearchField from '@/components/SearchField';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="w-[1200px] m-auto h-dvh flex flex-col p-4  gap-4">
      <h1>Home</h1>
      <div className="flex flex-col gap-4 w-[180px] p-4">
        <Button variant="default">독후감 작성</Button>
        <Button variant="outline">독후감 작성</Button>
        <Button variant="ghost">독후감 작성</Button>
        <Button variant="highlight">독후감 작성</Button>
      </div>
      <div className="w-full flex justify-end">
        <SearchField />
      </div>
      <BookMark />
    </main>
  );
}
