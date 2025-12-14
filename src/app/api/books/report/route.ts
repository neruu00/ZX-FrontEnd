import { NextResponse } from 'next/server';

import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: '검색어가 없습니다.' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('zx_test');

  const result = await db.collection('report').findOne({ isbn: query });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  //TODO - 유저 검증 로직
  /**
   * TODO
   * 이미 존재하는 독후감일 경우
   * create가 아니라 update 하기
   */
  const res = await request.json();
  const { isbn, title, content } = res;

  const client = await clientPromise;
  const db = client.db('zx_test');

  const createdAt = new Date().toISOString();

  const result = db.collection('report').insertOne({
    isbn,
    title,
    content,
    createdAt,
    updatedAt: createdAt,
  });
  //TODO - 응답 구체화
  return new Response(JSON.stringify(result));
}

export async function PUT(request: Request) {
  //TODO - 유저 검증 로직
  console.log('UPDATE request received');
  const res = await request.json();
  const { isbn, title, content } = res;

  const client = await clientPromise;
  const db = client.db('zx_test');

  const updatedAt = new Date().toISOString();

  const result = db.collection('report').updateOne(
    { isbn },
    {
      $set: {
        title,
        content,
        updatedAt,
      },
    },
  );
  console.log(result);
  //TODO - 응답 구체화
  return new Response(JSON.stringify(result));
}
