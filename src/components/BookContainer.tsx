import Book from './Book';

export type BookType = {
  id: number;
  title: string;
  author: string;
  genre: string;
  progress: number;
  rating: number;
  status: string;
  currentReaders: number;
  cover: string;
};

const books: BookType[] = [
  {
    id: 1,
    title: '사피엔스',
    author: 'Yuval Noah Harari',
    genre: '역사',
    progress: 84,
    rating: 5,
    status: 'reading',
    currentReaders: 247,
    cover:
      'https://i.namu.wiki/i/7AilEdOqy_qM-ggh8jmsspf5FRPnSU0wxpJIdRXk5vKMVpt3feIv6qXksLjUWJ5ZWrUE6KGiZmxghO1d_KOf2PuYHwgMy5sW_JkjmDmZdxu0hVc5229GvPEHi334SB8BT9wbagY2jj5rj3OAhOLvSg.webp',
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    genre: '고전',
    progress: 100,
    rating: 5,
    status: 'completed',
    currentReaders: 892,
    cover:
      'https://i.namu.wiki/i/6zPwOEL42uiSsmjel89iBrncAgbxfTeXjyaE_oCHZ9oOuSwE6wtovJffPhwScxHI95IWvVN0aFrXDoI28y9mv3lGqmnXcW2e_OECNvqU1Ys2XvuAcv-GgjGKoIYL1_i1tp6pERyu4yJ0VhGZds1lTA.webp',
  },
  {
    id: 3,
    title: '코스모스',
    author: 'Carl Sagan',
    genre: '과학',
    progress: 45,
    rating: 4,
    status: 'reading',
    currentReaders: 156,
    cover:
      'https://i.namu.wiki/i/nFWkfUjhdkziMj8bVsZPg1unVNHUfOWJzxTc063B5FF1FJKEa_iINUEYqCmnXx85DB-Z6vmjzcADuKntjKRKcjXgENwIHU439Jik-jBDh0qa7orKe-C60Z5s020uP2WnLK6xOYYcStnARD4W9-ihJg.webp',
  },
  {
    id: 4,
    title: '총, 균, 쇠',
    author: 'Jared Diamond',
    genre: '역사',
    progress: 0,
    rating: 0,
    status: 'pending',
    currentReaders: 412,
    cover:
      'https://i.namu.wiki/i/bBDzauek27CSgtIq-VFEyn5ni62fHK-HHiy9olFgJhqLbpXHhO4QK-DLNI3DM4JYJ8K_WXUrq0MAI-bYbugIEjpZDRadPgDOr_8rZOuDyM1_J4eW1b1DpRksYmeN1fVw2B2HdIixpvP_6gaESA4IEw.webp',
  },
  {
    id: 5,
    title: '이기적 유전자',
    author: 'Richard Dawkins',
    genre: '과학',
    progress: 100,
    rating: 5,
    status: 'completed',
    currentReaders: 328,
    cover:
      'https://i.namu.wiki/i/lxF9tL0wHcG-WLBIxm1szSg5iHoPT8cv5VwSZ91EvMJ0z0eFHvsAozj8JUbdxMB4fFhaZUpXBzdVMDqF03PjWIC2YGihy56qT63UfKmKMaoY171d3r6zvgh7fIhOUMpy3IDQFV18g9NR5wWmvuWYdw.webp',
  },
  {
    id: 6,
    title: '데미안',
    author: 'Hermann Hesse',
    genre: '고전',
    progress: 60,
    rating: 4,
    status: 'reading',
    currentReaders: 534,
    cover:
      'https://i.namu.wiki/i/7qQ701uvBS6hMz5M9zN2JxNT78nQ3QTHV0aAQKBzmVnvGIym7HDDGoekIwytOYCQ9qvNz98VYTgqncdU3qhDhqSwxLXrHiCXwggfcTVGNyqoiwRuZe_XW1Gxrqh6NtQB33LiqxxagroVr2SY7ziMwQ.webp',
  },
  {
    id: 7,
    title: '생각에 관한 생각',
    author: 'Daniel Kahneman',
    genre: '심리',
    progress: 100,
    rating: 5,
    status: 'completed',
    currentReaders: 621,
    cover: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788934981213.jpg',
  },
  {
    id: 8,
    title: '아토믹 해빗',
    author: 'James Clear',
    genre: '자기계발',
    progress: 72,
    rating: 5,
    status: 'reading',
    currentReaders: 1245,
    cover: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791162540640.jpg',
  },
  {
    id: 9,
    title: '명상록',
    author: 'Marcus Aurelius',
    genre: '철학',
    progress: 100,
    rating: 5,
    status: 'completed',
    currentReaders: 389,
    cover: 'https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791139704129.jpg',
  },
  {
    id: 10,
    title: '시간의 역사',
    author: 'Stephen Hawking',
    genre: '과학',
    progress: 38,
    rating: 0,
    status: 'reading',
    currentReaders: 278,
    cover: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788972914051.jpg',
  },
  {
    id: 11,
    title: '종의 기원',
    author: 'Charles Darwin',
    genre: '과학',
    progress: 100,
    rating: 5,
    status: 'completed',
    currentReaders: 167,
    cover:
      'https://i.namu.wiki/i/RZ1bIcYk1GPPJEajReXzBWWszEFB6N1J71vHBgSfUVYJkCcifsvKQv3-Oo6m-FifryCRzbEU84vxQfIil5cRbg.webp',
  },
  {
    id: 12,
    title: '손자병법',
    author: 'Sun Tzu',
    genre: '고전',
    progress: 100,
    rating: 4,
    status: 'completed',
    currentReaders: 445,
    cover: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791139728002.jpg',
  },
];

export default function BookContainer() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {books.map((book) => (
        <Book key={book.id} book={book} />
      ))}
    </div>
  );
}
