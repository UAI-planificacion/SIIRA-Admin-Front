'use client';

import { useState } from 'react';

import { toast }        from 'sonner';
import { Pencil, Plus } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
}                                        from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
}                                       from '@/components/ui/alert-dialog';
import {
    ProcessConfigForm,
    type ProcessConfigFormSubmit,
}                                       from '@/components/process-configs/process-config-form';
import {
    useCreateProcessConfig,
    useUpdateProcessConfig,
}                                       from '@/hooks/use-process-configs';
import {
    PROCESS_STATUS_LABELS,
    type ProcessConfig,
}                                       from '@/types/process-config';
import type { ProcessConfigFormValues } from '@/components/process-configs/validations/process-config';
import { Button }                       from '@/components/ui/button';


interface ProcessConfigDialogProps {
    mode: 'create' | 'edit';
    processConfig?: ProcessConfig;
    trigger?: React.ReactElement;
}


export function ProcessConfigDialog({
    mode,
    processConfig,
    trigger,
}: ProcessConfigDialogProps) {
    const [open, setOpen]                   = useState( false );
    const [confirmOpen, setConfirmOpen]     = useState( false );
    const [pendingValues, setPendingValues] = useState<ProcessConfigFormValues | null>( null );

    const createMutation = useCreateProcessConfig();
    const updateMutation = useUpdateProcessConfig();

    const isEdit        = mode === 'edit';
    const mutation      = isEdit ? updateMutation : createMutation;
    const isSubmitting  = mutation.isPending;

    const handleSubmit: ProcessConfigFormSubmit = ( values ) => {
        setPendingValues( values );
        setConfirmOpen( true );
    };

    const handleConfirm = async () => {
        if (!pendingValues) return;

        const payload = {
            periodId            : pendingValues.periodId,
            status              : pendingValues.status,
            totalRealStudents   : pendingValues.totalRealStudents,
            planningStartDate   : new Date( pendingValues.planningStartDate ).toISOString(),
            planningEndDate     : new Date( pendingValues.planningEndDate ).toISOString(),
            enrollmentStartDate : new Date( pendingValues.enrollmentStartDate ).toISOString(),
            enrollmentEndDate   : new Date( pendingValues.enrollmentEndDate ).toISOString(),
        };

        try {
            if ( isEdit && processConfig ) {
                await updateMutation.mutateAsync({
                    id      : processConfig.id,
                    input   : payload,
                });

                toast.success( 'Configuración actualizada correctamente.' );
            } else {
                await createMutation.mutateAsync( payload );

                toast.success( 'Configuración creada correctamente.' );
            }

            setConfirmOpen( false );
            setPendingValues( null );
            setOpen( false );
        } catch ( err ) {
            toast.error(
                err instanceof Error ? err.message : 'No se pudo guardar.'
            );
        }
    };

    const defaultTrigger =
        mode === 'create' ? (
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva configuración
            </Button>
        ) : (
            <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Editar
            </Button>
        );

    const confirmDescription = isEdit
        ? `¿Confirmas los cambios para el periodo "${pendingValues?.periodId}" (estado: ${
            pendingValues ? PROCESS_STATUS_LABELS[pendingValues.status] : ''
        })?`
        : `¿Confirmas la creación del periodo "${pendingValues?.periodId}" (estado: ${
            pendingValues ? PROCESS_STATUS_LABELS[pendingValues.status] : ''
        })?`;

    return (
        <>
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger render={ trigger ?? defaultTrigger } />

            <DialogContent className="max-h-[90vh] sm:max-w-xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit
                            ? 'Editar configuración'
                            : 'Nueva configuración de proceso'}
                    </DialogTitle>

                    <DialogDescription>
                        {isEdit
                            ? 'Modifica los datos del proceso académico.'
                            : 'Completa los datos del nuevo proceso académico.'}
                    </DialogDescription>
                </DialogHeader>

                <ProcessConfigForm
                    initialData     = { processConfig }
                    onSubmit        = { handleSubmit }
                    isSubmitting    = { isSubmitting }
                    submitLabel     = { isEdit ? 'Guardar cambios' : 'Crear configuración' }
                />
            </DialogContent>
        </Dialog>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar</AlertDialogTitle>

                    <AlertDialogDescription>
                        { confirmDescription }
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>

                    <AlertDialogAction
                        disabled    = { isSubmitting }
                        onClick     = { handleConfirm }
                    >
                        Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
