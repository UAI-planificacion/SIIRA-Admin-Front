'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarClock, Users, Clock, Hash, ClipboardCopy } from 'lucide-react';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { StatusBadge }                  from '@/components/process-configs/status-badge';
import { ProcessConfigDialog }          from '@/components/process-configs/process-config-dialog';
import { DeleteProcessConfigDialog }    from '@/components/process-configs/delete-process-config-dialog';
import type { ProcessConfig }           from '@/types/process-config';


function formatDate(iso: string) {
    return format(new Date(iso), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
}


function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-2.5 justify-start">
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>

                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}

export function ProcessConfigCard({
    config,
}: {
    config: ProcessConfig;
}) {
    return (
        <Card className="flex flex-col transition-shadow hover:shadow-md">
            <CardHeader className="space-y-0">
                <div className="flex gap-2 items-center justify-between w-full">
                    <CardTitle className="text-lg">{config.academicPeriod}</CardTitle>

                    <StatusBadge status={config.status} />
                </div>

                {/* <span className='text-[10px] text-muted-foreground underline flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors'>
                    { config.id }
                    <ClipboardCopy className='size-2.5' />
                </span> */}

                {/* <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />

                    <span className="text-sm font-semibold">
                        {config.totalRealStudents}
                    </span>
                </div> */}
            </CardHeader>

            <CardContent className="flex-1 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                    <InfoRow
                        icon    = { CalendarClock }
                        label   = "Borrador inicio"
                        value   = { formatDate( config.draftStartDate )}
                    />

                    <InfoRow
                        icon    = { CalendarClock }
                        label   = "Borrador fin"
                        value   = { formatDate( config.draftEndDate )}
                    />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <InfoRow
                        icon    = { Users }
                        label   = "Toma de ramos inicio"
                        value   = { formatDate( config.startDate )}
                    />

                    <InfoRow
                        icon    = { Users }
                        label   = "Toma de ramos fin"
                        value   = { formatDate( config.endDate )}
                    />
                </div>

                <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 justify-between">
                    <div className='flex gap-2 items-center'>
                        <Clock className="h-4 w-4 text-muted-foreground" />

                        <span className="text-sm font-medium">
                            {config.dailyStartHour}:00 - {config.dailyEndHour}:00 hrs
                        </span>
                    </div>
                    {/* <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                        <Hash className="h-3 w-3" />
                        { config.id.slice( -6 )}
                    </span> */}

                    <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />

                        <span className="text-sm font-semibold">
                            { config.totalRealStudents }
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="justify-end gap-2">
                <ProcessConfigDialog mode="edit" processConfig={config} />

                <DeleteProcessConfigDialog
                    processConfig={config}
                    variant="button"
                />
            </CardFooter>
        </Card>
    );
}
