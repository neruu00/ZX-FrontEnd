import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="bg-background">
      <h1>Home</h1>
      <div className="flex flex-col gap-4 w-[180px] p-4">
        <Button variant="default">독후감 작성</Button>
        <Button variant="outline">독후감 작성</Button>
        <Button variant="ghost">독후감 작성</Button>
        <Button variant="highlight">독후감 작성</Button>
      </div>
      <ThemeToggle />
    </main>
  );
}
