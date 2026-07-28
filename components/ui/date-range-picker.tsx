import { JSX } from 'react';

import {
    Calendar as CalendarIcon
}                       from 'lucide-react';
import { format }       from 'date-fns';
import { es }           from 'date-fns/locale';
import { DateRange }    from 'react-day-picker';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
}                   from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button }   from '@/components/ui/button';
import { cn }       from '@/lib/utils';


interface DatePickerWithRangeProps {
    value?          : DateRange;
    onChange?       : ( value: DateRange | undefined ) => void;
    placeholder?    : string;
    disabled?       : boolean;
    className?      : string;
    disabledDays?   : any;
}

export function DatePickerWithRange( {
    value,
    onChange,
    placeholder = 'Seleccionar fecha',
    disabled,
    className,
    disabledDays,
}: DatePickerWithRangeProps ): JSX.Element {
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
                        disabled        = { disabledDays }
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
