import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { clientPromise, collection } from '@/lib/mongodb';

type Params = {
  params: Promise<{
    isbn13: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  console.log('✈️ ROUTE: GET library isbn13');

  const session = await auth();
  const userId = session?.user.id;
  const { isbn13 } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const librarys = await collection('librarys');
    const result = await librarys.findOne({ userId, isbn13 });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('✈️ ROUTE: POST library isbn13');

  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { isbn13, title, author, cover, itemPage, readPages } = body;

  const docBody = {
    userId,
    isbn13,
    title,
    author,
    cover,
    itemPage,
    readPages,
  };

  try {
    const librarys = await collection('librarys');

    const exists = await librarys.findOne({ userId, isbn13 });

    if (exists) {
      return NextResponse.json(
        { message: '이미 서재에 있습니다.' },
        { status: 409 },
      );
    }

    const result = await librarys.insertOne(docBody);
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

export async function DELETE(request: NextRequest, { params }: Params) {
  console.log('✈️ ROUTE: DELETE library isbn13');

  const session = await auth();
  const userId = session?.user.id;
  const { isbn13 } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const mongoSession = client.startSession();

  try {
    mongoSession.startTransaction();

    const [reports, librarys] = await Promise.all([
      collection('reports'),
      collection('librarys'),
    ]);

    const filter = { userId, isbn13 };
    const [_, deleteBookResult] = await Promise.all([
      reports.deleteOne(filter, { session: mongoSession }),
      librarys.deleteOne(filter, { session: mongoSession }),
    ]);

    if (deleteBookResult.deletedCount === 0) {
      throw new Error('BOOK_NOT_FOUND');
    }

    await mongoSession.commitTransaction();

    return NextResponse.json(
      { message: '서재에서 책을 제거했습니다.', result: deleteBookResult },
      { status: 200 },
    );
  } catch (error) {
    await mongoSession.abortTransaction();

    if (error instanceof Error && error.message === 'BOOK_NOT_FOUND') {
      return NextResponse.json(
        { error: '서재에 해당 책이 없습니다.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 },
    );
  } finally {
    mongoSession.endSession();
  }
}
