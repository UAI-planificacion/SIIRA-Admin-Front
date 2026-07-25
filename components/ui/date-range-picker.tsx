import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerWithRangeProps {
    value?: DateRange;
    onChange?: ( value: DateRange | undefined ) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function DatePickerWithRange( {
    value,
    onChange,
    placeholder = 'Seleccionar fecha',
    disabled,
    className,
}: DatePickerWithRangeProps ): React.JSX.Element {
    const formatMonthShort = ( date: Date ): string => {
        return format( date, 'd MMM yyyy', { locale: es } ).replace( '.', '' );
    };

    return (
        <div className={ cn( 'grid gap-2', className ) }>
            <Popover>
                <PopoverTrigger render={
                    <Button
                        id          = "date"
                        variant     = "outline"
                        className   = { cn(
                            'w-full justify-start text-left font-normal h-8',
                            !value?.from && 'text-muted-foreground'
                        ) }
                        disabled    = { disabled }
                    />
                }>
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    { value?.from ? (
                        value.to ? (
                            <>
                                { formatMonthShort( value.from ) } — { formatMonthShort( value.to ) }
                            </>
                        ) : (
                            formatMonthShort( value.from )
                        )
                    ) : (
                        <span>{ placeholder }</span>
                    ) }
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        autoFocus
                        mode            = "range"
                        defaultMonth    = { value?.from }
                        selected        = { value }
                        onSelect        = { onChange }
                        numberOfMonths  = { 2 }
                        locale          = { es }
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
