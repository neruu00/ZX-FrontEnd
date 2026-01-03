import { BookListResponse } from '@/mocks/mockBookList';
import { BookLookUpResponse } from '@/types/aladin.type';

const key = process.env.ALADIN_API_TTBKEY;

type FetchBookSearchType = {
  query: string;
  queryType?: 'Keyword' | 'Title' | 'Author' | 'Publisher';
  start?: number;
  maxResults?: number;
};

const fetchBookSearch = async ({
  query,
  queryType = 'Keyword',
  start = 1,
  maxResults = 10,
}: FetchBookSearchType) => {
  if (!key) throw new Error('ttfkey is not defined');
  if (!query) throw new Error('query is not defined');

  try {
    const response = await fetch(
      `/api/open/book/aladin/search?query=${encodeURIComponent(query)}&queryType=${queryType}&start=${start}&maxResults=${maxResults}`,
    );
    if (!response.ok) {
      throw new Error(`알라딘 API 오류: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const fetchBookDetailProxy = async (
  isbn: string,
): Promise<BookLookUpResponse | undefined> => {
  try {
    const res = await fetch(
      `/api/open/book/aladin/detail?query=${encodeURIComponent(isbn)}`,
    );

    if (!res.ok) throw new Error('검색 실패');

    const data = await res.json();

    return data.item;
  } catch (error) {
    console.error(error);
  }
};

//NOTE - Use Only Server Components
const fetchBookDetail = async (
  isbn: string,
): Promise<BookLookUpResponse | undefined> => {
  if (!key) throw new Error('ttfkey is not defined');

  const baseUrl = 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx';
  const apiParams = new URLSearchParams({
    ttbkey: key,
    ItemId: isbn,
    ItemIdType: 'ISBN13',
    Output: 'JS',
    Version: '20131101',
    Cover: 'Big',
  });

  try {
    const response = await fetch(`${baseUrl}?${apiParams.toString()}`);

    if (!response.ok) {
      throw new Error(`알라딘 API 오류: ${response.status}`);
    }

    const textData = await response.text();
    const cleanData = textData.trim().replace(/;$/, '');

    const data = JSON.parse(cleanData);

    return data.item;
  } catch (error) {
    console.error('알라딘 에러:', error);
  }
};

const BOOK_LIST_QUERY_KEY = ['books', 'recommendeds'];

async function fetchBookListProxy() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/open/book/aladin/list`;
  const response = await fetch(url, {
    method: 'GET',
    next: {
      tags: BOOK_LIST_QUERY_KEY,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return (await response.json()) as BookListResponse;
}

export {
  fetchBookSearch,
  fetchBookDetailProxy,
  fetchBookDetail,
  fetchBookListProxy,
  BOOK_LIST_QUERY_KEY,
};
