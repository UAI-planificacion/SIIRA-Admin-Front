import { NextResponse } from 'next/server';
import { ENV }          from '@/config/envs/env';

export async function GET(): Promise<NextResponse> {
    try {
        const response = await fetch( `${ENV.REQUEST_BACK_URL}/process-configs`, {
            method  : 'GET',
            headers : {
                'accept': '*/*',
            },
        } );

        if ( !response.ok ) {
            return NextResponse.json(
                { error: `Error fetching process configs: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json( data, { status: 200 } );
    } catch ( error: any ) {
        return NextResponse.json(
            { error: error?.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
