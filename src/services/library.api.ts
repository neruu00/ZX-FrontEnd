import { auth } from '@/auth';
import { BookSearchResponse } from '@/types/aladin.type';
import { ObjectId } from 'mongodb';

type BookInLibraryType = {
  _id: ObjectId;
  userId: string;
  isbn13: string;
  title: string;
  author: string;
  itemPage: number;
  readPages: number;
  customerReviewRank: number;
};

type LibraryType = BookInLibraryType[];

export async function getLibrary(): Promise<LibraryType> {
  try {
    const response = await fetch('/api/books/librarys', {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch book report');
  }
}

export async function postLibrary(book: BookSearchResponse) {
  try {
    const response = await fetch('/api/books/librarys', {
      method: 'POST',
      cache: 'no-store',
      body: JSON.stringify({
        isbn13: book.isbn13,
        title: book.title,
        author: book.author,
        itemPage: book.subInfo.itemPage,
        readPages: 0,
        customerReviewRank: book.customerReviewRank,
      }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch book report');
  }
}
