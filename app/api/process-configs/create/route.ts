import { NextResponse } from 'next/server';
import { store } from '@/lib/data/process-configs';
import type { ProcessConfigInput } from '@/types/process-config';

const delay = () => new Promise((r) => setTimeout(r, 3000));

export async function POST(req: Request) {
  await delay();
  const body = (await req.json()) as ProcessConfigInput;

  if (store.existsByAcademicPeriod(body.academicPeriod)) {
    return NextResponse.json(
      { message: 'Ya existe un proceso con ese periodo académico.' },
      { status: 409 }
    );
  }

  const created = store.create(body);
  return NextResponse.json(created, { status: 201 });
}
