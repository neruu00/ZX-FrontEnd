import { NextRequest, NextResponse } from 'next/server';

import { collection } from '@/lib/mongodb';
import checkAuth from '@/lib/checkAuth';
import Validator from '@/lib/Validator';
import { ObjectId } from 'mongodb';

//SECTION - flow 조회(GET) 혹은 생성(POST)
export async function GET(request: NextRequest) {
  console.log('✈️ ROUTE: GET flows isbn13');

  const userId = await checkAuth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const isbn13 = searchParams.get('isbn13');
  if (!isbn13) {
    return NextResponse.json({ error: 'isbn13이 없습니다.' }, { status: 400 });
  }

  try {
    const flows = await collection('flows');
    const now = new Date();
    const result = await flows.findOneAndUpdate(
      {
        isbn13: isbn13,
        userId: userId,
      },

      {
        $set: {
          lastAccessedAt: now,
          updatedAt: now,
        },

        $setOnInsert: {
          isbn13: isbn13,
          userId: userId,
          elapsedTime: 0,
          createdAt: now,
        },
      },

      {
        upsert: true,
        returnDocument: 'after',
      },
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
//!SECTION - flow 조회(GET) 혹은 생성(POST)

//SECTION - flow 수정(UPDATE)
export async function PATCH(request: NextRequest) {
  console.log('✈️ ROUTE: PATCH flow');

  const userId = await checkAuth();
  if (!userId) {
    return NextResponse.json(
      { message: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  const body = await request.json();
  const { _id, elapsedTime } = body;

  if (!new Validator(_id).isObjectId().isValid()) {
    return NextResponse.json(
      { message: '유효하지 않은 집중 데이터 ID입니다.' },
      { status: 400 },
    );
  }

  if (!elapsedTime) {
    return NextResponse.json(
      { message: '경과 시간이 없습니다.' },
      { status: 400 },
    );
  }

  try {
    const flows = await collection('flows');
    const result = await flows.updateOne(
      { _id: new ObjectId(_id), userId },
      {
        $set: {
          elapsedTime,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: '해당 집중 데이터를 찾을 수 없습니다.' },
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
//!SECTION - flow 수정(UPDATE)
