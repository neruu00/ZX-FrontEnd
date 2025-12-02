const key = process.env.ALADIN_API_TTBKEY;

const fetchBookLookUpProxy = async (isbn: string) => {
  try {
    const res = await fetch(`/api/search/book/aladin?query=${encodeURIComponent(isbn)}`);

    if (!res.ok) throw new Error('검색 실패');

    const data = await res.json();

    return data.item;
  } catch (error) {
    console.error(error);
  }
};

const fetchBookLookUp = async (isbn: string) => {
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

export { fetchBookLookUpProxy, fetchBookLookUp };
