'use client';

import {
    Loader2,
    CalendarClock,
    Settings2,
    Clock,
    Users
}                       from 'lucide-react';
import { zodResolver }  from '@hookform/resolvers/zod';
import { useForm }      from 'react-hook-form';
import * as React       from 'react';
import { DateRange }    from 'react-day-picker';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
}                       from '@/components/ui/form';
import {
    processConfigSchema,
    type ProcessConfigFormValues,
}                       from '@/lib/validations/process-config';
import {
    type ProcessConfig,
}                       from '@/types/process-config';
import { Button }       from '@/components/ui/button';
import { Input }        from '@/components/ui/input';
import { Separator }    from '@base-ui/react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { TimeRangePicker, type TimeRange } from '@/components/ui/time-range-picker';


function toLocalInput( dateIso: string ): string {
    const d     = new Date( dateIso );
    const pad   = ( n: number ) => String( n ).padStart( 2, '0' );

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours()
    )}:${pad(d.getMinutes())}`;
}


export type ProcessConfigFormSubmit = (values: ProcessConfigFormValues) => void;


interface ProcessConfigFormProps {
    initialData?    : ProcessConfig;
    onSubmit        : ProcessConfigFormSubmit;
    isSubmitting?   : boolean;
    submitLabel?    : string;
}


export function ProcessConfigForm({
    initialData,
    onSubmit,
    isSubmitting,
    submitLabel = 'Guardar',
}: ProcessConfigFormProps) {
    const form = useForm<ProcessConfigFormValues>({
        resolver            : zodResolver( processConfigSchema ),
        defaultValues       : {
        academicPeriod      : initialData?.academicPeriod                               ?? '',
        status              : initialData?.status                                       ?? 'PENDING',
        totalRealStudents   : initialData?.totalRealStudents                            ?? 0,
        draftStartDate      : initialData ? toLocalInput( initialData.draftStartDate )  : '',
        draftEndDate        : initialData ? toLocalInput( initialData.draftEndDate   )  : '',
        startDate           : initialData ? toLocalInput( initialData.startDate      )  : '',
        endDate             : initialData ? toLocalInput( initialData.endDate        )  : '',
        dailyStartHour      : initialData?.dailyStartHour                               ?? 9,
        dailyEndHour        : initialData?.dailyEndHour                                 ?? 14,
        },
    });

    const getHHMM = ( isoString?: string ): string => {
        if ( !isoString ) return '00:00';
        const d = new Date( isoString );
        return `${String( d.getHours() ).padStart( 2, '0' )}:${String( d.getMinutes() ).padStart( 2, '0' )}`;
    };

    // Etapa de planificación
    const draftDateRange: DateRange | undefined = React.useMemo( () => {
        const fromVal = form.watch( 'draftStartDate' );
        const toVal   = form.watch( 'draftEndDate' );
        return {
            from : fromVal ? new Date( fromVal ) : undefined,
            to   : toVal ? new Date( toVal ) : undefined,
        };
    }, [ form.watch( 'draftStartDate' ), form.watch( 'draftEndDate' ) ] );

    const draftTimeRange: TimeRange = React.useMemo( () => {
        return {
            startTime : getHHMM( form.watch( 'draftStartDate' ) ),
            endTime   : getHHMM( form.watch( 'draftEndDate' ) ),
        };
    }, [ form.watch( 'draftStartDate' ), form.watch( 'draftEndDate' ) ] );

    const handleDraftDateRangeChange = ( range: DateRange | undefined ): void => {
        const startHHMM = getHHMM( form.getValues( 'draftStartDate' ) );
        const endHHMM   = getHHMM( form.getValues( 'draftEndDate' ) );

        if ( range?.from ) {
            const newStart = new Date( range.from );
            const [ h, m ] = startHHMM.split( ':' ).map( Number );
            newStart.setHours( h, m, 0, 0 );
            form.setValue( 'draftStartDate', newStart.toISOString(), { shouldValidate: true } );
        } else {
            form.setValue( 'draftStartDate', '', { shouldValidate: true } );
        }

        if ( range?.to ) {
            const newEnd   = new Date( range.to );
            const [ h, m ] = endHHMM.split( ':' ).map( Number );
            newEnd.setHours( h, m, 0, 0 );
            form.setValue( 'draftEndDate', newEnd.toISOString(), { shouldValidate: true } );
        } else {
            form.setValue( 'draftEndDate', '', { shouldValidate: true } );
        }
    };

    const handleDraftTimeRangeChange = ( timeRange: TimeRange ): void => {
        const startVal     = form.getValues( 'draftStartDate' );
        const endVal       = form.getValues( 'draftEndDate' );
        const currentStart = startVal ? new Date( startVal ) : new Date();
        const currentEnd   = endVal ? new Date( endVal ) : new Date();

        const [ sh, sm ] = timeRange.startTime.split( ':' ).map( Number );
        currentStart.setHours( sh, sm, 0, 0 );
        form.setValue( 'draftStartDate', currentStart.toISOString(), { shouldValidate: true } );

        const [ eh, em ] = timeRange.endTime.split( ':' ).map( Number );
        currentEnd.setHours( eh, em, 0, 0 );
        form.setValue( 'draftEndDate', currentEnd.toISOString(), { shouldValidate: true } );
    };

    // Toma de ramos
    const dateRange: DateRange | undefined = React.useMemo( () => {
        const fromVal = form.watch( 'startDate' );
        const toVal   = form.watch( 'endDate' );
        return {
            from : fromVal ? new Date( fromVal ) : undefined,
            to   : toVal ? new Date( toVal ) : undefined,
        };
    }, [ form.watch( 'startDate' ), form.watch( 'endDate' ) ] );

    const timeRange: TimeRange = React.useMemo( () => {
        return {
            startTime : getHHMM( form.watch( 'startDate' ) ),
            endTime   : getHHMM( form.watch( 'endDate' ) ),
        };
    }, [ form.watch( 'startDate' ), form.watch( 'endDate' ) ] );

    const handleDateRangeChange = ( range: DateRange | undefined ): void => {
        const startHHMM = getHHMM( form.getValues( 'startDate' ) );
        const endHHMM   = getHHMM( form.getValues( 'endDate' ) );

        if ( range?.from ) {
            const newStart = new Date( range.from );
            const [ h, m ] = startHHMM.split( ':' ).map( Number );
            newStart.setHours( h, m, 0, 0 );
            form.setValue( 'startDate', newStart.toISOString(), { shouldValidate: true } );
        } else {
            form.setValue( 'startDate', '', { shouldValidate: true } );
        }

        if ( range?.to ) {
            const newEnd   = new Date( range.to );
            const [ h, m ] = endHHMM.split( ':' ).map( Number );
            newEnd.setHours( h, m, 0, 0 );
            form.setValue( 'endDate', newEnd.toISOString(), { shouldValidate: true } );
        } else {
            form.setValue( 'endDate', '', { shouldValidate: true } );
        }
    };

    const handleTimeRangeChange = ( timeRange: TimeRange ): void => {
        const startVal     = form.getValues( 'startDate' );
        const endVal       = form.getValues( 'endDate' );
        const currentStart = startVal ? new Date( startVal ) : new Date();
        const currentEnd   = endVal ? new Date( endVal ) : new Date();

        const [ sh, sm ] = timeRange.startTime.split( ':' ).map( Number );
        currentStart.setHours( sh, sm, 0, 0 );
        form.setValue( 'startDate', currentStart.toISOString(), { shouldValidate: true } );

        const [ eh, em ] = timeRange.endTime.split( ':' ).map( Number );
        currentEnd.setHours( eh, em, 0, 0 );
        form.setValue( 'endDate', currentEnd.toISOString(), { shouldValidate: true } );
    };

    // Horario diario
    const dailyTimeRange: TimeRange = React.useMemo( () => {
        const sh = form.watch( 'dailyStartHour' );
        const eh = form.watch( 'dailyEndHour' );
        return {
            startTime : `${String( sh ).padStart( 2, '0' )}:00`,
            endTime   : `${String( eh ).padStart( 2, '0' )}:00`,
        };
    }, [ form.watch( 'dailyStartHour' ), form.watch( 'dailyEndHour' ) ] );

    const handleDailyTimeRangeChange = ( timeRange: TimeRange ): void => {
        const sh = Number( timeRange.startTime.split( ':' )[ 0 ] );
        const eh = Number( timeRange.endTime.split( ':' )[ 0 ] );
        form.setValue( 'dailyStartHour', sh, { shouldValidate: true } );
        form.setValue( 'dailyEndHour', eh, { shouldValidate: true } );
    };

    return (
        <Form {...form}>
            <form
                onSubmit    = { form.handleSubmit( onSubmit )}
                className   = "space-y-6"
            >
                {/* Periodo y estado */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Settings2 className="h-4 w-4" />
                        Configuración general
                    </div>

                    <div className="grid gap-4 sm:grid-cols-1">
                        <FormField
                            control = { form.control }
                            name    = "academicPeriod"
                            render  = {({ field }) => (
                                <FormItem>
                                    <FormLabel>Periodo académico</FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="2026-02"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormDescription>
                                        Formato AAAA-MM. Debe ser único.
                                    </FormDescription>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>

                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un estado" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {STATUS_VALUES.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    { PROCESS_STATUS_LABELS[ s ]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>

                    {/* <FormField
                        control={form.control}
                        name="totalRealStudents"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total de alumnos real</FormLabel>

                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={field.value}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value === '' ? 0 : Number(e.target.value)
                                            )
                                        }
                                    />
                                </FormControl>

                                <FormDescription>
                                    Cantidad real de alumnos del proceso.
                                </FormDescription>

                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                </section>

                <Separator className='border -mt-3 mb-3' />
 
                {/* Fechas de borrador */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <CalendarClock className="h-4 w-4" />
                        Etapa de planificación
                    </div>
 
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className=" flex flex-col gap-2">
                            <FormLabel className="text-xs">Rango de fechas</FormLabel>
                            <DatePickerWithRange
                                value       = { draftDateRange }
                                onChange    = { handleDraftDateRangeChange }
                            />
                            { ( form.formState.errors.draftStartDate || form.formState.errors.draftEndDate ) && (
                                <p className="text-xs font-medium text-destructive">
                                    { form.formState.errors.draftStartDate?.message || form.formState.errors.draftEndDate?.message }
                                </p>
                            ) }
                        </div>
 
                        <div className="flex flex-col gap-2">
                            <FormLabel className="text-xs">Rango de hora</FormLabel>
                            <TimeRangePicker
                                value       = { draftTimeRange }
                                onChange    = { handleDraftTimeRangeChange }
                            />
                        </div>
                    </div>
                </section>
 
                <Separator className='border -mt-1 mb-4' />
 
                {/* Fechas de toma de ramos */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Toma de ramos
                    </div>
 
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2 flex flex-col gap-2">
                            <FormLabel className="text-xs">Rango de fechas</FormLabel>
                            <DatePickerWithRange
                                value       = { dateRange }
                                onChange    = { handleDateRangeChange }
                            />
                            { ( form.formState.errors.startDate || form.formState.errors.endDate ) && (
                                <p className="text-xs font-medium text-destructive">
                                    { form.formState.errors.startDate?.message || form.formState.errors.endDate?.message }
                                </p>
                            ) }
                        </div>
 
                        <div className="flex flex-col gap-2">
                            <FormLabel className="text-xs">Rango de hora</FormLabel>
                            <TimeRangePicker
                                value       = { timeRange }
                                onChange    = { handleTimeRangeChange }
                            />
                        </div>
                    </div>
                </section>
 
                {/* Horario diario */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Horario diario
                    </div>
 
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-1 flex flex-col gap-2">
                            <FormLabel className="text-xs">Rango de horario diario</FormLabel>
                            <TimeRangePicker
                                value       = { dailyTimeRange }
                                onChange    = { handleDailyTimeRangeChange }
                            />
                            { ( form.formState.errors.dailyStartHour || form.formState.errors.dailyEndHour ) && (
                                <p className="text-xs font-medium text-destructive">
                                    { form.formState.errors.dailyStartHour?.message || form.formState.errors.dailyEndHour?.message }
                                </p>
                            ) }
                        </div>
                    </div>
                </section>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
