import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { collection } from '@/lib/mongodb';

//SECTION - 독후감(Report) 조회(GET)
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
    const reports = await collection('reports');
    const result = await reports.findOne({
      userId: session?.user.id,
      isbn13,
    });
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
  const session = await auth();
  const body = await request.json();
  const { isbn13, title, content } = body;

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
    const reports = await collection('reports');
    const now = new Date().toISOString();
    const newReport = {
      userId: session?.user.id,
      isbn13,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };

    const result = await reports.insertOne(newReport);
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
  const session = await auth();
  const body = await request.json();
  const { _id, title, content } = body;

  //TODO - 유저 검증 로직

  if (!session) {
    return NextResponse.json(
      { message: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }
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
    const reports = await collection('reports');
    const result = await reports.updateOne(
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

//SECTION - 독후감(Report) 삭제(DELETE)
export async function DELETE(request: NextRequest) {
  console.log('✈️ ROUTE: DELETE report');
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
    return NextResponse.json(
      { message: 'isbn13이 누락되었습니다.' },
      { status: 400 },
    );
  }

  try {
    const reports = await collection('reports');
    const result = await reports.deleteOne({
      userId: session?.user.id,
      isbn13,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: '삭제할 독후감을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: '독후감을 삭제했습니다.' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
//!SECTION - 독후감(Report) 삭제(DELETE)
