'use client';

import { useQuery }     from '@tanstack/react-query';
import type { Period }  from '@/types/periods';

export const PERIODS_KEY = [ 'periods' ] as const;


async function fetchPeriods(): Promise<Period[]> {
    const res = await fetch( '/api/periods/get-all' );

    if ( !res.ok ) {
        const errorData = await res.json().catch( () => ( {} ) );
        throw new Error( errorData?.error || 'Ocurrió un error inesperado.' );
    }

    return await res.json();
}


export function usePeriods() {
    return useQuery( {
        queryKey : PERIODS_KEY,
        queryFn  : fetchPeriods,
    } );
}
