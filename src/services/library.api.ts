import { ObjectId } from 'mongodb';

import { BookSearchResponse } from '@/types/aladin.type';

export type BookStatus = 'WISH' | 'COMPLETED' | 'PENDING' | null;

export type BookInLibraryType = {
  _id: ObjectId;
  userId: string;
  isbn13: string;
  title: string;
  author: string;
  cover: string;
  spineColor?: string;
  itemPage: number;
  readPages: number;
  shelf: number;
  order: number;
  status?: BookStatus;
};

export type LibraryType = BookInLibraryType[];

export async function getLibraryList(): Promise<LibraryType> {
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

export async function getLibrary(isbn13: string): Promise<BookInLibraryType> {
  try {
    const response = await fetch(`/api/books/librarys/${isbn13}`, {
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
    const response = await fetch(`/api/books/librarys/${book.isbn13}`, {
      method: 'POST',
      cache: 'no-store',
      body: JSON.stringify({
        isbn13: book.isbn13,
        title: book.title,
        author: book.author,
        cover: book.cover,
        itemPage: book.subInfo.itemPage,
        readPages: 0,
      }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch book report');
  }
}

export async function deleteLibrary(isbn13: string) {
  try {
    const response = await fetch(`/api/books/librarys/${isbn13}`, {
      method: 'DELETE',
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Network response was not ok');

    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch book report');
  }
}
