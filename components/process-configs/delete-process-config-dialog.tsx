'use client';

import { useState } from 'react';

import { toast }            from 'sonner';
import { Trash2, Loader2 }  from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
}                                   from '@/components/ui/alert-dialog';
import { Button }                   from '@/components/ui/button';
import { useDeleteProcessConfig }   from '@/hooks/use-process-configs';
import type { ProcessConfig }       from '@/types/process-config';


interface DeleteProcessConfigDialogProps {
    processConfig: ProcessConfig;
    variant?: 'button' | 'icon';
}


export function DeleteProcessConfigDialog({
    processConfig,
    variant = 'button',
}: DeleteProcessConfigDialogProps) {
    const [open, setOpen]   = useState(false);
    const deleteMutation    = useDeleteProcessConfig();

    const handleConfirm = async () => {
        try {
            await deleteMutation.mutateAsync(processConfig.id);

            toast.success('Configuración eliminada correctamente.');

            setOpen(false);
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : 'No se pudo eliminar.'
            );
        }
    };

    const trigger =
        variant === 'icon' ? (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
            </Button>
            ) : (
            <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
            </Button>
        );

    const periodLabel = processConfig.period
        ? `${processConfig.period.id} - ${processConfig.period.name}`
        : processConfig.periodId;

    return (
        <AlertDialog open={ open } onOpenChange={ setOpen }>
            <AlertDialogTrigger render={ trigger } />

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar configuración?</AlertDialogTitle>

                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará el periodo
                        <span className="font-semibold">
                            {' '}
                            { periodLabel }
                        </span>{' '}
                        de forma permanente.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>

                    <AlertDialogAction
                        disabled    = { deleteMutation.isPending }
                        onClick     = { handleConfirm }
                        className   = "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleteMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
