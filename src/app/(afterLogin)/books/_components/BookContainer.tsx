import { BookListResponse } from '@/types/aladin.type';

import Book from './Book';

interface Props {
  books?: BookListResponse;
}

export default function BookContainer({ books }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
      {books?.item.map((book) => (
        <Book key={book.isbn} book={book} />
      ))}
    </div>
  );
}
