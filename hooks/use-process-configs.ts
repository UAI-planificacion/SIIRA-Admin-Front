'use client';

import {
    useMutation,
    useQuery,
    useQueryClient,
}                       from '@tanstack/react-query';
import type {
    ProcessConfig,
    ProcessConfigInput,
}                       from '@/types/process-config';

export const PROCESS_CONFIGS_KEY = [ 'process-configs' ] as const;


async function fetchProcessConfigs(): Promise<ProcessConfig[]> {
    const res = await fetch( '/api/process-configs' );

    if ( !res.ok ) {
        const errorData = await res.json().catch( () => ( {} ) );
        throw new Error( errorData?.message || 'Ocurrió un error inesperado.' );
    }

    return res.json();
}


async function createProcessConfig( input: ProcessConfigInput ): Promise<ProcessConfig> {
    const res = await fetch( '/api/process-configs/create', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify( input ),
    } );

    if ( !res.ok ) {
        const errorData = await res.json().catch( () => ( {} ) );
        throw new Error( errorData?.message || 'Ocurrió un error inesperado.' );
    }

    return res.json();
}


async function updateProcessConfig( id: string, input: ProcessConfigInput ): Promise<ProcessConfig> {
    const res = await fetch( `/api/process-configs/${ id }`, {
        method  : 'PUT',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify( input ),
    } );

    if ( !res.ok ) {
        const errorData = await res.json().catch( () => ( {} ) );
        throw new Error( errorData?.message || 'Ocurrió un error inesperado.' );
    }

    return res.json();
}


async function deleteProcessConfig( id: string ): Promise<void> {
    const res = await fetch( `/api/process-configs/${ id }/delete`, {
        method: 'DELETE',
    } );

    if ( !res.ok && res.status !== 204 ) {
        const errorData = await res.json().catch( () => ( {} ) );
        throw new Error( errorData?.message || 'Ocurrió un error inesperado.' );
    }
}


export function useProcessConfigs() {
    return useQuery( {
        queryKey : PROCESS_CONFIGS_KEY,
        queryFn  : fetchProcessConfigs,
    } );
}


export function useCreateProcessConfig() {
    const qc = useQueryClient();

    return useMutation( {
        mutationFn: ( input: ProcessConfigInput ) => createProcessConfig( input ),
        onSuccess: () => qc.invalidateQueries( { queryKey: PROCESS_CONFIGS_KEY } ),
    } );
}


export function useUpdateProcessConfig() {
    const qc = useQueryClient();

    return useMutation( {
        mutationFn: ( {
            id,
            input,
        }: {
            id      : string;
            input   : ProcessConfigInput;
        } ) => updateProcessConfig( id, input ),
        onSuccess: ( updated: ProcessConfig ) => {
            qc.setQueryData<ProcessConfig[]>( PROCESS_CONFIGS_KEY, ( old?: ProcessConfig[] ) =>
                old ? old.map( ( c ) => ( c.id === updated.id ? updated : c ) ) : old
            );
        },
    } );
}


export function useDeleteProcessConfig() {
    const qc = useQueryClient();

    return useMutation( {
        mutationFn: ( id: string ) => deleteProcessConfig( id ),
        onSuccess: () => qc.invalidateQueries( { queryKey: PROCESS_CONFIGS_KEY } ),
    } );
}
