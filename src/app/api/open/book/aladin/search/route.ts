import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const queryType = searchParams.get('queryType') ?? 'Keyword';
  const start = searchParams.get('start') ?? '1';
  const maxResults = searchParams.get('maxResults') ?? '10';

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: '검색어를 2글자 이상 입력해주세요.' },
      { status: 400 },
    );
  }

  const ttbKey = process.env.ALADIN_API_TTBKEY;

  if (!ttbKey) {
    return NextResponse.json(
      { error: '서버 내부 오류: TTBKey 누락' },
      { status: 500 },
    );
  }

  // 알라딘 API 설정
  const baseUrl = 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx';
  const apiParams = new URLSearchParams({
    ttbkey: ttbKey,
    Query: query,
    QueryType: queryType,
    ItemIdType: 'ISBN13',
    Output: 'JS',
    Version: '20131101',
    Cover: 'Big',
    Start: start,
    MaxResults: maxResults,
  });

  try {
    // 서버에서 알라딘으로 요청 (CORS, 로컬 제한 우회)
    const response = await fetch(`${baseUrl}?${apiParams.toString()}`);

    if (!response.ok) {
      throw new Error(`알라딘 API 오류: ${response.status}`);
    }

    // 알라딘은 JSON을 주지만, 응답 헤더가 텍스트일 수 있어 .json() 대신 텍스트로 받아 파싱 추천
    // 가끔 끝에 세미콜론(;)이 붙어오는 경우가 있어 제거 처리
    const textData = await response.text();
    // 혹시라도 세미콜론이 있으면 제거
    const cleanData = textData.trim().replace(/;$/, '');

    const data = JSON.parse(cleanData);

    return NextResponse.json(data);
  } catch (error) {
    console.error('알라딘 프록시 에러:', error);
    return NextResponse.json({ error: '알라딘 검색 실패' }, { status: 500 });
  }
}
