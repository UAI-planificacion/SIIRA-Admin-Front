"use client";

import {
    JSX,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import { Clock } from 'lucide-react';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
}                   from '@/components/ui/popover';
import { Button }   from '@/components/ui/button';
import { cn }       from '@/lib/utils';


export interface TimeRange {
    startTime   : string;
    endTime     : string;
}


interface TimeRangePickerProps {
    value?      : TimeRange;
    onChange?   : ( value: TimeRange ) => void;
    disabled?   : boolean;
    minHour?    : number;
    maxHour?    : number;
    step?       : number;
    className?  : string;
}


interface TimePickerFieldProps {
    value       : string;
    onChange    : ( val: string ) => void;
    minHour     : number;
    maxHour     : number;
    step        : number;
    disabled    : boolean;
}


const parseTime = ( timeStr: string ) => {
    const [ h, m ] = ( timeStr || '00:00' ).split( ':' ).map( Number );
    return { hour: isNaN( h ) ? 0 : h, minute: isNaN( m ) ? 0 : m };
};


const formatTime = ( hour: number, minute: number ): string => {
    return `${String( hour ).padStart( 2, '0' )}:${String( minute ).padStart( 2, '0' )}`;
};


function TimePickerDropdownContent( {
    selectedHour,
    selectedMinute,
    hours,
    minutes,
    onHourSelect,
    onMinuteSelect,
    onKeyDownHour,
    onKeyDownMinute,
}: {
    selectedHour    : number;
    selectedMinute  : number;
    hours           : number[];
    minutes         : number[];
    onHourSelect    : ( h: number ) => void;
    onMinuteSelect  : ( m: number ) => void;
    onKeyDownHour   : ( e: React.KeyboardEvent<HTMLButtonElement>, val: number ) => void;
    onKeyDownMinute : ( e: React.KeyboardEvent<HTMLButtonElement>, val: number ) => void;
} ): JSX.Element {
    const hourContainerRef   = useRef<HTMLDivElement>( null );
    const minuteContainerRef = useRef<HTMLDivElement>( null );

    useEffect( () => {
        const selectedHourEl = hourContainerRef.current?.querySelector( '[data-selected="true"]' );

        if ( selectedHourEl ) {
            selectedHourEl.scrollIntoView( { block: 'center', behavior: 'instant' as any } );
        }

        const selectedMinuteEl = minuteContainerRef.current?.querySelector( '[data-selected="true"]' );

        if ( selectedMinuteEl ) {
            selectedMinuteEl.scrollIntoView( { block: 'center', behavior: 'instant' as any } );
        }
    }, [] );

    return (
        <div className="flex gap-1 h-48 p-1">
            <div
                ref         = { hourContainerRef }
                style       = { { scrollbarWidth: 'none' } }
                className   = "flex flex-col overflow-y-auto w-14 border-r border-border/50 pr-1 gap-0.5"
            >
                { hours.map( ( h ) => {
                    const isSelected = h === selectedHour;
                    return (
                        <button
                            key             = { h }
                            type            = "button"
                            data-time-value = { h }
                            data-time-type  = "hour"
                            data-selected   = { isSelected }
                            tabIndex        = { isSelected ? 0 : -1 }
                            className       = { cn(
                                'w-full text-center py-1 text-xs rounded-md font-medium transition-colors outline-hidden focus:bg-accent cursor-pointer',
                                isSelected
                                    ? 'bg-primary text-primary-foreground focus:bg-primary'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            ) }
                            onClick         = { () => onHourSelect( h ) }
                            onKeyDown       = { ( e ) => onKeyDownHour( e, h ) }
                        >
                            { String( h ).padStart( 2, '0' ) }
                        </button>
                    );
                })}
            </div>

            <div
                ref         = { minuteContainerRef }
                style       = { { scrollbarWidth: 'none' } }
                className   = "flex flex-col overflow-y-auto w-14 gap-0.5"
            >
                { minutes.map( ( m ) => {
                    const isSelected = m === selectedMinute;
                    return (
                        <button
                            key             = { m }
                            type            = "button"
                            data-time-value = { m }
                            data-time-type  = "minute"
                            data-selected   = { isSelected }
                            tabIndex        = { isSelected ? 0 : -1 }
                            className       = { cn(
                                'w-full text-center py-1 text-xs rounded-md font-medium transition-colors outline-hidden focus:bg-accent cursor-pointer',
                                isSelected
                                    ? 'bg-accent text-accent-foreground font-semibold border border-foreground/10 focus:bg-accent'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            ) }
                            onClick         = { () => onMinuteSelect( m ) }
                            onKeyDown       = { ( e ) => onKeyDownMinute( e, m ) }
                        >
                            { String( m ).padStart( 2, '0' ) }
                        </button>
                    );
                } ) }
            </div>
        </div>
    );
}


function TimePickerField({
    value,
    onChange,
    minHour,
    maxHour,
    step,
    disabled,
}: TimePickerFieldProps ): JSX.Element {
    const [ isOpen, setIsOpen ] = useState( false );


    const { hour, minute } = useMemo( () => parseTime( value ), [ value ] );


    const hours = useMemo( () => {
        const arr = [];
        for ( let i = minHour; i <= maxHour; i++ ) {
            arr.push( i );
        }
        return arr;
    }, [ minHour, maxHour ] );


    const minutes = useMemo( () => {
        const arr = [];
        for ( let i = 0; i < 60; i += step ) {
            arr.push( i );
        }
        return arr;
    }, [ step ] );


    const handleHourSelect = ( h: number ) => {
        onChange( formatTime( h, minute ) );
    };


    const handleMinuteSelect = ( m: number ) => {
        onChange( formatTime( hour, m ) );
    };


    const handleKeyDown = (
        e           : React.KeyboardEvent<HTMLButtonElement>,
        currentVal  : number,
        options     : number[],
        onSelect    : ( val: number ) => void
    ) => {
        const currentIndex = options.indexOf( currentVal );

        let nextIndex = currentIndex;

        if ( e.key === 'ArrowDown' ) {
            e.preventDefault();
            nextIndex = ( currentIndex + 1 ) % options.length;
        } else if ( e.key === 'ArrowUp' ) {
            e.preventDefault();
            nextIndex = ( currentIndex - 1 + options.length ) % options.length;
        } else if ( e.key === 'Enter' || e.key === ' ' ) {
            e.preventDefault();
            onSelect( options[ currentIndex ] );
            return;
        } else {
            return;
        }

        const nextVal = options[ nextIndex ];

        onSelect( nextVal );

        setTimeout( () => {
            const btn = document.querySelector(
                `[data-time-value="${nextVal}"][data-time-type="${e.currentTarget.getAttribute( 'data-time-type' )}"]`
            ) as HTMLButtonElement;
            btn?.focus();
            btn?.scrollIntoView( { block: 'nearest' } );
        }, 0 );
    };

    return (
        <Popover open={ isOpen } onOpenChange={ setIsOpen }>
            <PopoverTrigger render={
                <Button
                    variant     = "ghost"
                    className   = "flex items-center gap-1.5 h-7 px-2 font-normal text-sm text-foreground hover:bg-accent rounded-md focus-visible:ring-1 focus-visible:ring-ring select-none cursor-pointer"
                    disabled    = { disabled }
                    type        = "button"
                />
            }>
                <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{ value }</span>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-1" align="start">
                <TimePickerDropdownContent
                    selectedHour    = { hour }
                    selectedMinute  = { minute }
                    hours           = { hours }
                    minutes         = { minutes }
                    onHourSelect    = { handleHourSelect }
                    onMinuteSelect  = { handleMinuteSelect }
                    onKeyDownHour   = { ( e, val ) => handleKeyDown( e, val, hours, handleHourSelect ) }
                    onKeyDownMinute = { ( e, val ) => handleKeyDown( e, val, minutes, handleMinuteSelect ) }
                />
            </PopoverContent>
        </Popover>
    );
}


export function TimeRangePicker( {
    onChange,
    value       = { startTime: '09:00', endTime: '18:00' },
    disabled    = false,
    minHour     = 0,
    maxHour     = 23,
    step        = 5,
    className,
}: TimeRangePickerProps ): JSX.Element {
    return (
        <div
            className={ cn(
                'border-input focus-within:border-ring focus-within:ring-ring/50 flex h-8 w-full min-w-0 items-center justify-between gap-1 rounded-lg border bg-transparent px-2 py-1 text-sm shadow-xs transition-all focus-within:ring-3 disabled:pointer-events-none disabled:opacity-50',
                className
            )}
        >
            <TimePickerField
                value       = { value.startTime }
                onChange    = { ( val ) => onChange?.( { ...value, startTime: val } ) }
                minHour     = { minHour }
                maxHour     = { maxHour }
                step        = { step }
                disabled    = { disabled }
            />

            <span className="text-muted-foreground text-xs select-none px-1">—</span>

            <TimePickerField
                value       = { value.endTime }
                onChange    = { ( val ) => onChange?.( { ...value, endTime: val } ) }
                minHour     = { minHour }
                maxHour     = { maxHour }
                step        = { step }
                disabled    = { disabled }
            />
        </div>
    );
}
