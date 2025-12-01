import BookMark from '@/components/BookMark';
import BookShelf from '@/components/BookShelf';

export default function HomePage() {
  return (
    <main className="m-auto flex h-dvh w-[920px] flex-col gap-4 p-4">
      <h1>Home</h1>
      <BookShelf />
      <BookMark />
    </main>
  );
}
