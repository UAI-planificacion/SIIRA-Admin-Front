import { NextResponse } from 'next/server';
import { store } from '@/lib/data/process-configs';

const delay = () => new Promise((r) => setTimeout(r, 3000));

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay();
  const { id } = await params;
  const ok = store.delete( id );
  if ( !ok ) {
    return NextResponse.json(
      { message: 'Configuración no encontrada.' },
      { status: 404 }
    );
  }
  return new NextResponse(null, { status: 204 });
}
