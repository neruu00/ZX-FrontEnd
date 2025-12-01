import { XMLParser } from 'fast-xml-parser';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. 클라이언트가 보낸 ISBN 받기
  const { searchParams } = new URL(request.url);
  const isbn = searchParams.get('isbn');

  if (!isbn) {
    return NextResponse.json({ error: 'ISBN이 필요합니다.' }, { status: 400 });
  }

  // 2. 환경 변수 체크 (서버 내부이므로 안전함)
  const clientId = process.env.NAVER_API_CLIENT_ID;
  const clientSecret = process.env.NAVER_API_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: '서버 API 키 설정 오류' }, { status: 500 });
  }

  // 3. 네이버 API 호출 (XML 요청)

  const params = new URLSearchParams({
    d_isbn: isbn,
    display: '1',
    start: '1',
  });

  const url = `https://openapi.naver.com/v1/search/book_adv.xml?${params.toString()}`;

  console.log(url);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    });

    console.log(res);

    if (!res.ok) {
      throw new Error(`네이버 API 오류: ${res.status}`);
    }

    // 4. XML 텍스트 추출 및 JSON 변환
    const xmlText = await res.text();

    const parser = new XMLParser({
      ignoreAttributes: false, // 속성값 유지
      textNodeName: 'value', // 태그 안의 텍스트를 어떤 키로 저장할지
    });

    const parsedData = parser.parse(xmlText);

    // 5. 실제 필요한 데이터만 추출 (RSS 구조 고려)
    // 네이버 응답 구조: rss -> channel -> item
    const bookData = parsedData?.rss?.channel?.item;

    if (!bookData) {
      return NextResponse.json({ message: '검색 결과가 없습니다.' }, { status: 404 });
    }

    // 6. 깔끔해진 JSON 반환
    return NextResponse.json(bookData);
  } catch (error) {
    console.error('API 호출 중 에러:', error);
    return NextResponse.json({ error: '서버 내부 오류 발생' }, { status: 500 });
  }
}
