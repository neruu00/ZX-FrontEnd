type BookType = {
  isbn: number;
  title: string;
  author: string;
  page: number;
  readPage: number;
  cover: string;
  rank: number;
};

type UserType = {
  id: string;
  name: string;
  email: string;
  books: BookType[];
};

const userData = {
  id: '1234',
  name: '홍길동',
  email: 'example1234@google.com',
  books: [
    // 1. 인문/역사
    {
      isbn: 9788934972464,
      title: '사피엔스',
      author: '유발 하라리',
      page: 636,
      readPage: 450, // 진행 중
      cover: 'https://image.aladin.co.kr/product/31424/4/cover200/k482832219_1.jpg',
      rank: 9,
    },
    // 2. 고전 소설
    {
      isbn: 9788937460777,
      title: '1984',
      author: '조지 오웰',
      page: 444,
      readPage: 444, // 완독
      cover: 'https://image.aladin.co.kr/product/41/89/cover200/s122531356_2.jpg',
      rank: 9,
    },
    // 3. 과학 (대작)
    {
      isbn: 9788983711892,
      title: '코스모스',
      author: '칼 세이건',
      page: 719,
      readPage: 120, // 읽기 시작함
      cover: 'https://image.aladin.co.kr/product/87/9/cover200/s412032094_1.jpg',
      rank: 9,
    },
    // 4. 한국 소설 (베스트셀러)
    {
      isbn: 9791130605210,
      title: '아몬드',
      author: '손원평',
      page: 264,
      readPage: 0, // 읽기 전
      cover: 'https://image.aladin.co.kr/product/31282/49/cover200/k162832578_2.jpg',
      rank: 10,
    },
    // 5. 과학/에세이
    {
      isbn: 9791187142560,
      title: '물고기는 존재하지 않는다',
      author: '룰루 밀러',
      page: 300,
      readPage: 280, // 거의 다 읽음
      cover: 'https://image.aladin.co.kr/product/20945/79/cover200/s652933016_2.jpg',
      rank: 9,
    },
    // 6. 고전 (필독서)
    {
      isbn: 9788937460449,
      title: '데미안',
      author: '헤르만 헤세',
      page: 248,
      readPage: 100,
      cover: 'https://image.aladin.co.kr/product/26/0/cover200/s742633278_2.jpg',
      rank: 9,
    },
    // 7. 경제/경영
    {
      isbn: 9791188331796,
      title: '돈의 속성',
      author: '김승호',
      page: 288,
      readPage: 50,
      cover: 'https://image.aladin.co.kr/product/35910/69/cover200/k412037592_2.jpg',
      rank: 9,
    },
    // 8. 판타지
    {
      isbn: 9788983927620,
      title: '해리 포터와 마법사의 돌 1',
      author: 'J.K. 롤링',
      page: 284,
      readPage: 284, // 완독
      cover: 'https://image.aladin.co.kr/product/21573/93/cover200/8983927623_2.jpg',
      rank: 9,
    },
    // 9. 인문 (벽돌책)
    {
      isbn: 9788970127248,
      title: '총, 균, 쇠',
      author: '재레드 다이아몬드',
      page: 752,
      readPage: 30, // 앞부분만 조금 읽음
      cover: 'https://image.aladin.co.kr/product/30192/3/cover200/k142839095_1.jpg',
      rank: 9,
    },
    // 10. 소설 (힐링)
    {
      isbn: 9791191056556,
      title: '미드나잇 라이브러리',
      author: '매트 헤이그',
      page: 408,
      readPage: 200, // 절반
      cover: 'https://image.aladin.co.kr/product/26987/37/cover200/s622931315_1.jpg',
      rank: 8,
    },
    // 11. SF (최신 인기)
    {
      isbn: 9788936434595,
      title: '우리가 빛의 속도로 갈 수 없다면',
      author: '김초엽',
      page: 344,
      readPage: 320,
      cover: 'https://image.aladin.co.kr/product/29137/2/cover200/8936434594_2.jpg',
      rank: 8,
    },
    // 12. 고전 (동화)
    {
      isbn: 9788932917245,
      title: '어린 왕자',
      author: '앙투안 드 생텍쥐페리',
      page: 136,
      readPage: 136, // 완독 (짧은 책)
      cover: 'https://image.aladin.co.kr/product/6853/49/cover200/8932917248_2.jpg',
      rank: 8,
    },
  ],
};

export type { BookType, UserType };
export { userData };
