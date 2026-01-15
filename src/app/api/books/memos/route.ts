import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

//SECTION - 메모(memo) 조회(GET)
export async function GET(request: NextRequest) {
  const session = await auth();
  const { searchParams } = request.nextUrl;
  const isbn13 = searchParams.get('isbn13');

  if (!session) {
    return NextResponse.json(
      { message: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  if (!isbn13) {
    return NextResponse.json({ error: 'isbn13이 없습니다.' }, { status: 400 });
  }

  try {
    const collection = await getCollection('memos');
    const result = await collection
      .find({
        userId: session?.user.id,
        isbn13,
      })
      .limit(12)
      .toArray();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
//!SECTION - 메모(memo) 조회(GET)

//SECTION - 메모(memo) 생성(POST)
export async function POST(request: NextRequest) {
  const session = await auth();
  const body = await request.json();
  const { isbn13, content } = body;

  //TODO - 유저 검증 로직

  if (!session) {
    return NextResponse.json(
      { message: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }
  if (!isbn13) {
    return NextResponse.json(
      { message: 'isbn13이 누락되었습니다.' },
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
    const collection = await getCollection('memos');
    const now = new Date().toISOString();
    const newMemo = {
      userId: session?.user.id,
      isbn13,
      content,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(newMemo);
    return NextResponse.json(
      { message: '메모를 저장했습니다.', id: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
//!SECTION - 메모(memo) 생성(POST)
