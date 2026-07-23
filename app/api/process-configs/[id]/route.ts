import { NextResponse } from 'next/server';
import { store } from '@/lib/data/process-configs';
import type { ProcessConfigInput } from '@/types/process-config';

const delay = () => new Promise((r) => setTimeout(r, 3000));

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay();
  const { id } = await params;
  const body = ( await req.json() ) as ProcessConfigInput;

  if ( store.existsByAcademicPeriod( body.academicPeriod, id ) ) {
    return NextResponse.json(
      { message: 'Ya existe un proceso con ese periodo académico.' },
      { status: 409 }
    );
  }

  const updated = store.update( id, body );
  if ( !updated ) {
    return NextResponse.json(
      { message: 'Configuración no encontrada.' },
      { status: 404 }
    );
  }
  return NextResponse.json(updated);
}
