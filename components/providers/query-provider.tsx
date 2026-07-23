'use client';

import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools }               from '@tanstack/react-query-devtools';

if ( typeof window !== 'undefined' && process.env.NODE_ENV === 'development' ) {
    const orig = console.error;
    console.error = ( ...args: unknown[] ) => {
        if ( typeof args[ 0 ] === 'string' && args[ 0 ].includes( 'Encountered a script tag' ) ) {
            return;
        }
        orig.apply( console, args );
    };
}

interface QueryProviderProps {
    children: React.ReactNode;
}

export function QueryProvider( { children }: QueryProviderProps ): React.JSX.Element {
    const [ queryClient ] = useState( () => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime            : 60 * 1000,
                refetchOnWindowFocus : false,
            },
        },
    }) );

    return (
        <QueryClientProvider client={ queryClient }>
            { children }

            { process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={ false } />
            ) }
        </QueryClientProvider>
    );
}
