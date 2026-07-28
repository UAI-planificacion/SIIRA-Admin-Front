import { NextResponse } from 'next/server';
import { ENV }          from '@/config/envs/env';
import type { ProcessConfigInput } from '@/types/process-config';

export async function POST( req: Request ): Promise<NextResponse> {
    try {
        const body = ( await req.json() ) as ProcessConfigInput;

        const response = await fetch( `${ENV.REQUEST_BACK_URL}/process-configs`, {
            method  : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'accept'       : '*/*',
            },
            body    : JSON.stringify( body ),
        } );

        if ( !response.ok ) {
            const errData = await response.json().catch( () => ( {} ) );
            return NextResponse.json(
                { message: errData?.message || 'Error al crear la configuración del proceso.' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json( data, { status: 201 } );
    } catch ( error: any ) {
        return NextResponse.json(
            { message: error?.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
