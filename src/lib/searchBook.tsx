const searchBookWithNaver = async (isbn: number | string) => {
  try {
    const res = await fetch(`/api/search/book/naver?isbn=${isbn}`);

    if (!res.ok) {
      throw new Error('검색에 실패했습니다.');
    }

    const data = await res.json();

    console.log('변환된 책 정보:', data);
  } catch (error) {
    console.error(error);
    alert('책을 불러오지 못했어요.');
  }
};

const searchBookWithAladin = async (isbn: number | string) => {
  try {
    const res = await fetch(`/api/search/book/aladin?query=${encodeURIComponent(isbn)}`);

    if (!res.ok) throw new Error('검색 실패');

    const data = await res.json();

    console.log(data.item);
    return data.item;
  } catch (error) {
    console.error(error);
    alert('책을 불러오지 못했어요.');
  }
};

const searchBook = {
  naver: searchBookWithNaver,
  aladin: searchBookWithAladin,
};

export default searchBook;
