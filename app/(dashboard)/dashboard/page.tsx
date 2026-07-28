'use client';

import { JSX } from 'react';

import { ProcessConfigView } from '@/components/process-configs/process-config-view';


export default function DashboardPage(): JSX.Element {
    return (
        <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
			<ProcessConfigView />
        </div>
    );
}
