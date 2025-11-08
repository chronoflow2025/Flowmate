import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_DATA === 'true';

export async function getUserId(): Promise<string | null> {
  if (MOCK_MODE) {
    return 'mock-user-123';
  }
  
  const { userId } = await auth();
  return userId;
}

export function unauthorized() {
  return NextResponse.json(
    { error: 'Unauthorized', code: 'UNAUTHORIZED' },
    { status: 401 }
  );
}

export function badRequest(message: string) {
  return NextResponse.json(
    { error: message, code: 'BAD_REQUEST' },
    { status: 400 }
  );
}

export function notFound(message: string = 'Resource not found') {
  return NextResponse.json(
    { error: message, code: 'NOT_FOUND' },
    { status: 404 }
  );
}

export function serverError(message: string = 'Internal server error') {
  return NextResponse.json(
    { error: message, code: 'INTERNAL_ERROR' },
    { status: 500 }
  );
}

export function success<T>(data: T, status: number = 200) {
  return NextResponse.json({ data }, { status });
}
