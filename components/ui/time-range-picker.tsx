import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimeRange {
    startTime: string;
    endTime: string;
}

interface TimeRangePickerProps {
    value?: TimeRange;
    onChange?: ( value: TimeRange ) => void;
    disabled?: boolean;
    className?: string;
}

export function TimeRangePicker( {
    value = { startTime: '09:00', endTime: '18:00' },
    onChange,
    disabled = false,
    className,
}: TimeRangePickerProps ): React.JSX.Element {
    const handleStartChange = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        onChange?.( { ...value, startTime: e.target.value } );
    };

    const handleEndChange = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        onChange?.( { ...value, endTime: e.target.value } );
    };

    return (
        <div
            className={ cn(
                'border-input focus-within:border-ring focus-within:ring-ring/50 flex h-8 w-full min-w-0 items-center gap-2 rounded-lg border bg-transparent px-2.5 py-1.5 text-sm shadow-xs transition-all focus-within:ring-3 disabled:pointer-events-none disabled:opacity-50',
                className
            ) }
        >
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />

            <input
                type        = "time"
                value       = { value.startTime }
                onChange    = { handleStartChange }
                disabled    = { disabled }
                className   = "bg-transparent outline-hidden border-0 text-sm p-0 w-18 focus:ring-0 text-foreground dark:scheme-dark select-none"
            />

            <span className="text-muted-foreground text-xs select-none">—</span>

            <input
                type        = "time"
                value       = { value.endTime }
                onChange    = { handleEndChange }
                disabled    = { disabled }
                className   = "bg-transparent outline-hidden border-0 text-sm p-0 w-18 focus:ring-0 text-foreground dark:scheme-dark select-none"
            />
        </div>
    );
}
