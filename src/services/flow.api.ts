import { ObjectId } from 'mongodb';

export type FlowType = {
  _id: ObjectId;
  userId: string;
  isbn13: string;
  elapsedTime: number;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export async function getOrCreateFlow({
  isbn13,
}: {
  isbn13: string;
}): Promise<FlowType> {
  try {
    const response = await fetch(`/api/books/flows?isbn13=${isbn13}`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch Flow');
  }
}

export async function updateFlow({
  _id,
  elapsedTime,
}: {
  _id: string;
  elapsedTime: number;
}) {
  try {
    const response = await fetch('/api/books/flows', {
      method: 'PATCH',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id,
        elapsedTime,
      }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch flow');
  }
}
