import { z } from 'zod';

export const processConfigSchema = z.object({
    periodId: z
        .string()
        .min( 1, 'El periodo académico es obligatorio.' ),
    status: z.enum([ 'PENDING', 'PLANNING_STAGE', 'ENROLLMENT_STAGE', 'CLOSED' ]),
    totalRealStudents: z
        .number( { error: 'Debe ser un número.' } )
        .int( 'Debe ser un entero.' )
        .min( 0, 'No puede ser negativo.' ),
    planningStartDate: z.string().min( 1, 'Fecha obligatoria.' ),
    planningEndDate: z.string().min( 1, 'Fecha obligatoria.' ),
    enrollmentStartDate: z.string().min( 1, 'Fecha obligatoria.' ),
    enrollmentEndDate: z.string().min( 1, 'Fecha obligatoria.' ),
}).refine( ( d ) => new Date( d.planningEndDate ) >= new Date( d.planningStartDate ), {
    message : 'La fecha fin debe ser posterior a la de inicio.',
    path    : [ 'planningEndDate' ],
}).refine( ( d ) => new Date( d.enrollmentEndDate ) >= new Date( d.enrollmentStartDate ), {
    message : 'La fecha fin debe ser posterior a la de inicio.',
    path    : [ 'enrollmentEndDate' ],
}).refine( ( d ) => !d.enrollmentStartDate || !d.planningEndDate || new Date( d.enrollmentStartDate ) > new Date( d.planningEndDate ), {
    message : 'La etapa de inscripción debe comenzar después de la etapa de planificación.',
    path    : [ 'enrollmentStartDate' ],
});

export type ProcessConfigFormValues = z.infer<typeof processConfigSchema>;
