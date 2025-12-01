import { userData } from '@/mock/user';

import Book from './Book';

export default function BookContainer() {
  const { books } = userData;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {books.map((book) => (
        <Book key={book.isbn} book={book} />
      ))}
    </div>
  );
}
