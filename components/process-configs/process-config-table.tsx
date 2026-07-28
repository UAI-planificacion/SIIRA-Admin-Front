'use client';

import { JSX } from 'react';

import { format }   from 'date-fns';
import { es }       from 'date-fns/locale';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
}                                       from '@/components/ui/table';
import { StatusBadge }                  from '@/components/process-configs/status-badge';
import { ProcessConfigDialog }          from '@/components/process-configs/process-config-dialog';
import { DeleteProcessConfigDialog }    from '@/components/process-configs/delete-process-config-dialog';
import type { ProcessConfig }           from '@/types/process-config';


const fmt = ( iso: string ) => format( new Date( iso ), 'dd/MM/yyyy HH:mm', { locale: es } );


export function ProcessConfigTable( {
    configs,
}: {
    configs: ProcessConfig[];
} ): JSX.Element {
    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[15%]">Periodo</TableHead>
                        <TableHead className="w-[15%]">Estado</TableHead>
                        <TableHead className="w-[10%] text-right">Alumnos</TableHead>
                        <TableHead className="w-[28%]">Planificación</TableHead>
                        <TableHead className="w-[27%]">Inscripción</TableHead>
                        <TableHead className="w-[5%] text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {configs.map((c) => {
                        const periodLabel = `${c.period.id} - ${c.period.name}`;

                        return (
                            <TableRow key={c.id}>
                                <TableCell className="font-medium">{periodLabel}</TableCell>

                                <TableCell>
                                    <StatusBadge status={c.status} />
                                </TableCell>

                                <TableCell className="text-right">
                                    {c.totalRealStudents}
                                </TableCell>

                                <TableCell className="text-xs text-muted-foreground">
                                    {fmt(c.planningStartDate)}
                                    <br />→ {fmt(c.planningEndDate)}
                                </TableCell>

                                <TableCell className="text-xs text-muted-foreground">
                                    {fmt(c.enrollmentStartDate)}
                                    <br />→ {fmt(c.enrollmentEndDate)}
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <ProcessConfigDialog
                                            mode            = "edit"
                                            processConfig   = { c }
                                            disabled        = { c.status === 'PLANNING_STAGE' || c.status === 'ENROLLMENT_STAGE' }
                                            trigger         = {
                                                <button
                                                    type="button"
                                                    aria-label="Editar"
                                                    disabled    = { c.status === 'PLANNING_STAGE' || c.status === 'ENROLLMENT_STAGE' }
                                                    className   = "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="h-4 w-4"
                                                    >
                                                        <path d="M12 20h9" />
                                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                                    </svg>
                                                </button>
                                            }
                                        />

                                        <DeleteProcessConfigDialog
                                            processConfig={c}
                                            variant="icon"
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
