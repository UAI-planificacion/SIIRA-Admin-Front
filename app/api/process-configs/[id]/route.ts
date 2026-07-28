import { NextResponse } from 'next/server';
import { ENV }          from '@/config/envs/env';
import type { ProcessConfigInput } from '@/types/process-config';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        const body = ( await req.json() ) as ProcessConfigInput;

        const response = await fetch( `${ENV.REQUEST_BACK_URL}/process-configs/${id}`, {
            method  : 'PATCH',
            headers : {
                'Content-Type' : 'application/json',
                'accept'       : '*/*',
            },
            body    : JSON.stringify( body ),
        } );

        if ( !response.ok ) {
            const errData = await response.json().catch( () => ( {} ) );
            return NextResponse.json(
                { message: errData?.message || 'Error al actualizar la configuración del proceso.' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json( data, { status: 200 } );
    } catch ( error: any ) {
        return NextResponse.json(
            { message: error?.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
