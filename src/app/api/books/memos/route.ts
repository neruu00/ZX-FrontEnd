import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

import checkAuth from '@/lib/checkAuth';
import isValidObjectId from '@/lib/isValidObjectId';
import { collection } from '@/lib/mongodb';

//SECTION - 메모(memo) 조회(GET)
export async function GET(request: NextRequest) {
  console.log('✈️ ROUTE: GET memos');

  const userId = await checkAuth();
  if (!userId) {
    return NextResponse.json(
      { message: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  const { searchParams } = request.nextUrl;
  const isbn13 = searchParams.get('isbn13');
  if (!isbn13) {
    return NextResponse.json({ error: 'isbn13이 없습니다.' }, { status: 400 });
  }

  try {
    const memos = await collection('memos');
    const result = await memos
      .find({
        userId,
        isbn13,
      })
      .sort({ createdAt: -1 })
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
  console.log('✈️ ROUTE: POST memo');

  const userId = await checkAuth();
  if (!userId) {
    return NextResponse.json(
      { message: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  const body = await request.json();
  const { isbn13, content } = body;
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
    const memos = await collection('memos');
    const now = new Date();
    const newMemo = {
      userId,
      isbn13,
      content,
      createdAt: now,
      updatedAt: now,
    };

    const result = await memos.insertOne(newMemo);
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

//SECTION - 메모(memo) 수정(UPDATE)
export async function PATCH(request: NextRequest) {
  console.log('✈️ ROUTE: PATCH memo');

  const userId = await checkAuth();
  if (!userId) {
    return NextResponse.json(
      { message: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  const body = await request.json();
  const { _id, content } = body;

  if (!_id || !isValidObjectId(_id)) {
    return NextResponse.json(
      { message: '유효하지 않은 메모 ID입니다.' },
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
    const memos = await collection('memos');
    const result = await memos.updateOne(
      { _id: new ObjectId(_id), userId },
      {
        $set: {
          content,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: '해당 메모을 찾을 수 없습니다.' },
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
//!SECTION - 메모(memo) 수정(UPDATE)

//SECTION - 메모(memo) 삭제(DELETE)
export async function DELETE(request: NextRequest) {
  console.log('✈️ ROUTE: DELETE memo');

  const userId = await checkAuth();
  if (!userId) {
    return NextResponse.json(
      { message: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  const { searchParams } = request.nextUrl;
  const _id = searchParams.get('_id');
  if (!_id || !isValidObjectId(_id)) {
    return NextResponse.json(
      { message: '유효하지 않은 메모 ID입니다.' },
      { status: 400 },
    );
  }

  try {
    const memos = await collection('memos');
    const result = await memos.deleteOne({
      userId,
      _id: new ObjectId(_id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: '삭제할 메모을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: '메모를 삭제했습니다.' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
//!SECTION - 메모(memo) 삭제(DELETE)
