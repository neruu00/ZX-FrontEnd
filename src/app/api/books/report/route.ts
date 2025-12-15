import { NextRequest, NextResponse } from 'next/server';

import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// mongoDB 컬렉션 가져오기
//TODO - 공통 모듈로 분리하기
//TODO - 에러 핸들링
async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db('zx_test');
  return db.collection(collectionName);
}

//SECTION - 독후감(Report) 조회(GET)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const isbn = searchParams.get('isbn');

  if (!isbn) {
    return NextResponse.json({ error: 'isbn이 없습니다.' }, { status: 400 });
  }

  try {
    const collection = await getCollection('report');
    const result = await collection.findOne({ isbn });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
//!SECTION - 독후감(Report) 조회(GET)

//SECTION - 독후감(Report) 생성(POST)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { isbn, title, content } = body;

  //TODO - 유저 검증 로직

  if (!isbn) {
    return NextResponse.json(
      { message: 'isbn이 누락되었습니다.' },
      { status: 400 },
    );
  }
  if (!title) {
    return NextResponse.json(
      { message: '제목을 입력해주세요.' },
      { status: 400 },
    );
  }
  if (!content) {
    return NextResponse.json(
      { message: '내용을 입력해주세요' },
      { status: 400 },
    );
  }

  try {
    const collection = await getCollection('report');
    const now = new Date().toISOString();
    const newReport = {
      isbn,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(newReport);
    return NextResponse.json(
      { message: '독후감을 저장했습니다.', id: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
//!SECTION - 독후감(Report) 생성(POST)

//SECTION - 독후감(Report) 수정(UPDATE)
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { _id, title, content } = body;

  //TODO - 유저 검증 로직

  if (!_id) {
    return NextResponse.json(
      { message: '저장할 독후감의 id가 누락되었습니다.' },
      { status: 400 },
    );
  }
  if (!title) {
    return NextResponse.json(
      { message: '제목을 입력해주세요.' },
      { status: 400 },
    );
  }
  if (!content) {
    return NextResponse.json(
      { message: '내용을 입력해주세요' },
      { status: 400 },
    );
  }

  try {
    const collection = await getCollection('report');
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          title,
          content,
          updatedAt: new Date().toISOString(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: '해당 게시물을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: '수정이 완료되었습니다.' });
  } catch (error) {
    return NextResponse.json(
      { message: '수정 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
//!SECTION - 독후감(Report) 수정(UPDATE)
