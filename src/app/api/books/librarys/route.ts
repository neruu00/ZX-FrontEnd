import { auth } from '@/auth';
import { getCollection } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('✈️ ROUTE: GET library');

  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const collection = await getCollection('librarys');
    const result = await collection.find({ userId }).limit(12).toArray();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('✈️ ROUTE: POST library');

  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    isbn13,
    title,
    author,
    cover,
    itemPage,
    readPages,
    customerReviewRank,
  } = body;

  const docBody = {
    userId,
    isbn13,
    title,
    author,
    cover,
    itemPage,
    readPages,
    customerReviewRank,
  };

  try {
    const collection = await getCollection('librarys');

    const exists = await collection.findOne({ userId, isbn13 });

    if (exists) {
      return NextResponse.json(
        { message: '이미 서재에 있습니다.' },
        { status: 409 },
      );
    }

    const result = await collection.insertOne(docBody);
    return NextResponse.json(
      { message: '서재에 책을 추가했습니다.', id: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
