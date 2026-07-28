'use client';

import { ElementType, JSX } from 'react';

import {
    CalendarClock,
    Users
}                   from 'lucide-react';
import { format }   from 'date-fns';
import { es }       from 'date-fns/locale';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
}                                       from '@/components/ui/card';
import { StatusBadge }                  from '@/components/process-configs/status-badge';
import { ProcessConfigDialog }          from '@/components/process-configs/process-config-dialog';
import { DeleteProcessConfigDialog }    from '@/components/process-configs/delete-process-config-dialog';
import type { ProcessConfig }           from '@/types/process-config';


const formatDate = ( iso: string ): string => format( new Date( iso ), "d 'de' MMM 'de' yyyy, HH:mm", { locale: es });


interface InfoRowProps {
    icon    : ElementType;
    label   : string;
    value   : string;
}


function InfoRow( {
    icon: Icon,
    label,
    value,
}: InfoRowProps ): JSX.Element {
    return (
        <div className="flex items-start gap-2 justify-start">
            <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5" />

            <div className="min-w-0 space-y-0.5">
                <p className="text-[11px] font-medium text-muted-foreground">{ label }</p>

                <p className="text-xs font-semibold text-foreground">{ value }</p>
            </div>
        </div>
    );
}


export function ProcessConfigCard({
    config,
}: {
    config: ProcessConfig;
}): JSX.Element {
    const periodLabel = config.period
        ? `${config.period.id} - ${config.period.name}`
        : config.periodId;

    return (
        <Card className="flex flex-col transition-all hover:shadow-md">
            <CardHeader className="space-y-0 pb-1">
                <div className="flex gap-2 items-center justify-between w-full">
                    <CardTitle className="text-lg font-bold">{ periodLabel }</CardTitle>

                    <StatusBadge status={config.status} />
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-3">
                {/* Etapa de planificación */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2.5 transition-colors hover:bg-muted/30">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground border-b border-border/40 pb-1.5">
                        <CalendarClock className="h-3.5 w-3.5 text-primary" />
                        <span>Etapa de planificación</span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <InfoRow
                            icon    = { CalendarClock }
                            label   = "Inicio"
                            value   = { formatDate( config.planningStartDate )}
                        />

                        <InfoRow
                            icon    = { CalendarClock }
                            label   = "Fin"
                            value   = { formatDate( config.planningEndDate )}
                        />
                    </div>
                </div>

                {/* Etapa de inscripción */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2.5 transition-colors hover:bg-muted/30">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground border-b border-border/40 pb-1.5">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        <span>Etapa de inscripción</span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <InfoRow
                            icon    = { Users }
                            label   = "Inicio"
                            value   = { formatDate( config.enrollmentStartDate )}
                        />

                        <InfoRow
                            icon    = { Users }
                            label   = "Fin"
                            value   = { formatDate( config.enrollmentEndDate )}
                        />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-2 border-t pt-4 mt-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg border">
                    <Users className="h-4 w-4 shrink-0" />
                    <span className="font-semibold text-foreground">
                        { config.totalRealStudents }
                    </span>
                    <span className="text-xs">alumnos</span>
                </div>

                <div className="flex gap-2">
                    <ProcessConfigDialog mode="edit" processConfig={ config } />

                    <DeleteProcessConfigDialog
                        processConfig   = { config }
                        variant         = "button"
                    />
                </div>
            </CardFooter>
        </Card>
    );
}
