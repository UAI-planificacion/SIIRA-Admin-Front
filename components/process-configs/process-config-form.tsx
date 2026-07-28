'use client';

import { useMemo, useEffect } from 'react';
import {
    Loader2,
    CalendarClock,
    Settings2,
    CalendarPlus2
}                       from 'lucide-react';
import { zodResolver }  from '@hookform/resolvers/zod';
import { useForm }      from 'react-hook-form';
import { DateRange }    from 'react-day-picker';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
}                                           from '@/components/ui/form';
import {
    processConfigSchema,
    type ProcessConfigFormValues,
}                                           from '@/components/process-configs/validations/process-config';
import { type ProcessConfig }               from '@/types/process-config';
import { TimeRangePicker, type TimeRange }  from '@/components/ui/time-range-picker';
import { Button }                           from '@/components/ui/button';
import { DatePickerWithRange }              from '@/components/ui/date-range-picker';
import { DynamicSelect }                    from '@/components/shared/inputs/DynamicSelect';
import { usePeriods }                       from '@/hooks/use-periods';


function toLocalInput( dateIso: string ): string {
    const d     = new Date( dateIso );
    const pad   = ( n: number ) => String( n ).padStart( 2, '0' );

    return `${d.getFullYear()}-${pad( d.getMonth() + 1 )}-${pad( d.getDate() )}T${pad(
        d.getHours()
    )}:${pad( d.getMinutes() )}`;
}


export type ProcessConfigFormSubmit = ( values: ProcessConfigFormValues ) => void;


interface ProcessConfigFormProps {
    initialData?    : ProcessConfig;
    onSubmit        : ProcessConfigFormSubmit;
    isSubmitting?   : boolean;
    submitLabel?    : string;
}


export function ProcessConfigForm( {
    initialData,
    onSubmit,
    isSubmitting,
    submitLabel = 'Guardar',
}: ProcessConfigFormProps ) {
    const { data: periods = [], isLoading: isLoadingPeriods } = usePeriods();

    const formatPeriodDate = ( isoString: string ): string => {
        const d = new Date( isoString );
        return `${String( d.getDate() ).padStart( 2, '0' )}/${String( d.getMonth() + 1 ).padStart( 2, '0' )}/${d.getFullYear()}`;
    };

    const selectOptions = useMemo( () => {
        return periods.map( ( p ) => ( {
            label    : `${p.id}-${p.name} ${formatPeriodDate( p.startDate )} - ${formatPeriodDate( p.endDate )}`,
            value    : p.id,
            disabled : p.status !== 'Pending',
            status   : p.status,
        } ) );
    }, [ periods ] );

    const form = useForm<ProcessConfigFormValues>( {
        resolver            : zodResolver( processConfigSchema ),
        defaultValues       : {
            periodId            : initialData?.periodId                                     ?? '',
            status              : initialData?.status                                       ?? 'PENDING',
            totalRealStudents   : initialData?.totalRealStudents                            ?? 0,
            planningStartDate   : initialData ? toLocalInput( initialData.planningStartDate )  : '',
            planningEndDate     : initialData ? toLocalInput( initialData.planningEndDate )    : '',
            enrollmentStartDate : initialData ? toLocalInput( initialData.enrollmentStartDate )  : '',
            enrollmentEndDate   : initialData ? toLocalInput( initialData.enrollmentEndDate )    : '',
        },
    } );

    const planningEndDateVal = form.watch( 'planningEndDate' );

    const disabledEnrollmentDays = useMemo( () => {
        if ( !planningEndDateVal ) return undefined;

        const planningEnd = new Date( planningEndDateVal );
        planningEnd.setHours( 0, 0, 0, 0 );

        return ( date: Date ) => {
            const d = new Date( date );
            d.setHours( 0, 0, 0, 0 );
            return d.getTime() <= planningEnd.getTime();
        };
    }, [ planningEndDateVal ] );

    useEffect( () => {
        const enrollStart = form.getValues( 'enrollmentStartDate' );

        if ( planningEndDateVal && enrollStart ) {
            const planningEnd = new Date( planningEndDateVal );
            planningEnd.setHours( 0, 0, 0, 0 );

            const enrollmentStart = new Date( enrollStart );
            enrollmentStart.setHours( 0, 0, 0, 0 );

            if ( enrollmentStart.getTime() <= planningEnd.getTime() ) {
                form.setValue( 'enrollmentStartDate', '', { shouldValidate: true } );
                form.setValue( 'enrollmentEndDate', '', { shouldValidate: true } );
            }
        }
    }, [ planningEndDateVal, form ] );

    const getHHMM = ( isoString?: string ): string => {
        if ( !isoString ) return '00:00';

        const d = new Date( isoString );

        return `${String( d.getHours() ).padStart( 2, '0' )}:${String( d.getMinutes() ).padStart( 2, '0' )}`;
    };

    // Etapa de planificación
    const planningDateRange: DateRange | undefined = useMemo( () => {
        const fromVal = form.watch( 'planningStartDate' );
        const toVal   = form.watch( 'planningEndDate' );

        return {
            from : fromVal  ? new Date( fromVal )   : undefined,
            to   : toVal    ? new Date( toVal )     : undefined,
        };
    }, [ form.watch( 'planningStartDate' ), form.watch( 'planningEndDate' ) ] );

    const planningTimeRange: TimeRange = useMemo( () => {
        return {
            startTime : getHHMM( form.watch( 'planningStartDate' ) ),
            endTime   : getHHMM( form.watch( 'planningEndDate' ) ),
        };
    }, [ form.watch( 'planningStartDate' ), form.watch( 'planningEndDate' ) ] );

    const handlePlanningDateRangeChange = ( range: DateRange | undefined ): void => {
        const startHHMM = getHHMM( form.getValues( 'planningStartDate' ) );
        const endHHMM   = getHHMM( form.getValues( 'planningEndDate' ) );

        if ( range?.from ) {
            const newStart = new Date( range.from );
            const [ h, m ] = startHHMM.split( ':' ).map( Number );

            newStart.setHours( h, m, 0, 0 );

            form.setValue( 'planningStartDate', newStart.toISOString(), { shouldValidate: true } );
        } else {
            form.setValue( 'planningStartDate', '', { shouldValidate: true } );
        }

        if ( range?.to ) {
            const newEnd   = new Date( range.to );
            const [ h, m ] = endHHMM.split( ':' ).map( Number );

            newEnd.setHours( h, m, 0, 0 );

            form.setValue( 'planningEndDate', newEnd.toISOString(), { shouldValidate: true } );
        } else {
            form.setValue( 'planningEndDate', '', { shouldValidate: true } );
        }
    };

    const handlePlanningTimeRangeChange = ( timeRange: TimeRange ): void => {
        const startVal      = form.getValues( 'planningStartDate' );
        const endVal        = form.getValues( 'planningEndDate' );
        const currentStart  = startVal  ? new Date( startVal )  : new Date();
        const currentEnd    = endVal    ? new Date( endVal )    : new Date();
        const [ sh, sm ]    = timeRange.startTime.split( ':' ).map( Number );

        currentStart.setHours( sh, sm, 0, 0 );

        form.setValue( 'planningStartDate', currentStart.toISOString(), { shouldValidate: true } );

        const [ eh, em ] = timeRange.endTime.split( ':' ).map( Number );

        currentEnd.setHours( eh, em, 0, 0 );

        form.setValue( 'planningEndDate', currentEnd.toISOString(), { shouldValidate: true } );
    };

    // Etapa de inscripción
    const enrollmentDateRange: DateRange | undefined = useMemo( () => {
        const fromVal = form.watch( 'enrollmentStartDate' );
        const toVal   = form.watch( 'enrollmentEndDate' );

        return {
            from : fromVal  ? new Date( fromVal )   : undefined,
            to   : toVal    ? new Date( toVal )     : undefined,
        };
    }, [ form.watch( 'enrollmentStartDate' ), form.watch( 'enrollmentEndDate' ) ] );

    const enrollmentTimeRange: TimeRange = useMemo( () => {
        return {
            startTime : getHHMM( form.watch( 'enrollmentStartDate' ) ),
            endTime   : getHHMM( form.watch( 'enrollmentEndDate' ) ),
        };
    }, [ form.watch( 'enrollmentStartDate' ), form.watch( 'enrollmentEndDate' ) ] );

    const handleEnrollmentDateRangeChange = ( range: DateRange | undefined ): void => {
        const startHHMM = getHHMM( form.getValues( 'enrollmentStartDate' ) );
        const endHHMM   = getHHMM( form.getValues( 'enrollmentEndDate' ) );

        if ( range?.from ) {
            const newStart = new Date( range.from );
            const [ h, m ] = startHHMM.split( ':' ).map( Number );

            newStart.setHours( h, m, 0, 0 );

            form.setValue( 'enrollmentStartDate', newStart.toISOString(), { shouldValidate: true } );
        } else {
            form.setValue( 'enrollmentStartDate', '', { shouldValidate: true } );
        }

        if ( range?.to ) {
            const newEnd   = new Date( range.to );
            const [ h, m ] = endHHMM.split( ':' ).map( Number );

            newEnd.setHours( h, m, 0, 0 );

            form.setValue( 'enrollmentEndDate', newEnd.toISOString(), { shouldValidate: true } );
        } else {
            form.setValue( 'enrollmentEndDate', '', { shouldValidate: true } );
        }
    };

    const handleEnrollmentTimeRangeChange = ( timeRange: TimeRange ): void => {
        const startVal      = form.getValues( 'enrollmentStartDate' );
        const endVal        = form.getValues( 'enrollmentEndDate' );
        const currentStart  = startVal  ? new Date( startVal )  : new Date();
        const currentEnd    = endVal    ? new Date( endVal )    : new Date();
        const [ sh, sm ]    = timeRange.startTime.split( ':' ).map( Number );

        currentStart.setHours( sh, sm, 0, 0 );

        form.setValue( 'enrollmentStartDate', currentStart.toISOString(), { shouldValidate: true } );

        const [ eh, em ] = timeRange.endTime.split( ':' ).map( Number );

        currentEnd.setHours( eh, em, 0, 0 );

        form.setValue( 'enrollmentEndDate', currentEnd.toISOString(), { shouldValidate: true } );
    };

    return (
        <Form { ...form }>
            <form
                onSubmit    = { form.handleSubmit( onSubmit ) }
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
                            name    = "periodId"
                            render  = { ( { field } ) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Periodo académico</FormLabel>

                                    <FormControl>
                                        <DynamicSelect
                                            options             = { selectOptions }
                                            defaultValues       = { field.value ? [ field.value ] : [] }
                                            placeholder         = "Seleccionar periodo académico..."
                                            searchPlaceholder   = "Buscar periodo..."
                                            multiple            = { false }
                                            isLoading           = { isLoadingPeriods }
                                            onSelectionChange   = { field.onChange }
                                        />
                                    </FormControl>

                                    <FormDescription>
                                        Selecciona un periodo académico disponible (sólo con estado Pendiente).
                                    </FormDescription>

                                    <FormMessage />
                                </FormItem>
                            ) }
                        />
                    </div>
                </section>

                {/* Fechas de planificación */}
                <fieldset className="border border-border rounded-xl p-5 bg-card/20 space-y-4">
                    <legend className="-ml-1 px-2 text-sm font-semibold text-muted-foreground flex items-center gap-2 select-none">
                        <CalendarClock className="h-4 w-4" />
                        Etapa de planificación
                    </legend>

                    <div className="grid gap-4 sm:grid-cols-2 -mt-4">
                        <div className="flex flex-col gap-2">
                            <FormLabel className="text-xs">Rango de fechas</FormLabel>

                            <DatePickerWithRange
                                value       = { planningDateRange }
                                onChange    = { handlePlanningDateRangeChange }
                            />
                            { ( form.formState.errors.planningStartDate || form.formState.errors.planningEndDate ) && (
                                <p className="text-xs font-medium text-destructive">
                                    { form.formState.errors.planningStartDate?.message || form.formState.errors.planningEndDate?.message }
                                </p>
                            ) }
                        </div>

                        <div className="flex flex-col gap-2">
                            <FormLabel className="text-xs">Rango de hora</FormLabel>

                            <TimeRangePicker
                                value       = { planningTimeRange }
                                onChange    = { handlePlanningTimeRangeChange }
                                minHour     = { 0 }
                                maxHour     = { 23 }
                                step        = { 5 }
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Fechas de inscripción */}
                <fieldset className="border border-border rounded-xl p-5 bg-card/20 space-y-4">
                    <legend className="-ml-1 px-2 text-sm font-semibold text-muted-foreground flex items-center gap-2 select-none">
                        <CalendarPlus2 className="size-4" />
                        Etapa de inscripción
                    </legend>

                    <div className="grid gap-4 sm:grid-cols-2 -mt-4">
                        <div className="flex flex-col gap-2">
                            <FormLabel className="text-xs">Rango de fechas</FormLabel>

                            <DatePickerWithRange
                                value           = { enrollmentDateRange }
                                onChange        = { handleEnrollmentDateRangeChange }
                                disabledDays    = { disabledEnrollmentDays }
                            />

                            { ( form.formState.errors.enrollmentStartDate || form.formState.errors.enrollmentEndDate ) && (
                                <p className="text-xs font-medium text-destructive">
                                    { form.formState.errors.enrollmentStartDate?.message || form.formState.errors.enrollmentEndDate?.message }
                                </p>
                            ) }
                        </div>

                        <div className="flex flex-col gap-2">
                            <FormLabel className="text-xs">Rango de hora</FormLabel>

                            <TimeRangePicker
                                value       = { enrollmentTimeRange }
                                onChange    = { handleEnrollmentTimeRangeChange }
                                minHour     = { 0 }
                                maxHour     = { 23 }
                                step        = { 5 }
                            />
                        </div>
                    </div>
                </fieldset>

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
