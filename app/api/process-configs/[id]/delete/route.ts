import { NextResponse } from 'next/server';
import { ENV }          from '@/config/envs/env';

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;

        const response = await fetch( `${ENV.REQUEST_BACK_URL}/process-configs/${id}`, {
            method  : 'DELETE',
            headers : {
                'accept': '*/*',
            },
        } );

        if ( !response.ok ) {
            const errData = await response.json().catch( () => ( {} ) );
            return NextResponse.json(
                { message: errData?.message || 'Error al eliminar la configuración del proceso.' },
                { status: response.status }
            );
        }

        return new NextResponse( null, { status: 204 } );
    } catch ( error: any ) {
        return NextResponse.json(
            { message: error?.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
