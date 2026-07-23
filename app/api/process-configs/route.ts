import { NextResponse } from 'next/server';
import { store } from '@/lib/data/process-configs';

const delay = () => new Promise((r) => setTimeout(r, 3000));

export async function GET() {
  await delay();
  return NextResponse.json(store.list());
}
