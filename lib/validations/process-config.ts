import { z } from 'zod';

export const processConfigSchema = z.object({
    academicPeriod: z
        .string()
        .min(1, 'El periodo académico es obligatorio.')
        .regex(
            /^\d{4}-\d{2}$/,
            'Formato inválido. Ejemplo: 2026-02.'
    ),
    status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
    totalRealStudents: z
        .number( { error: 'Debe ser un número.' } )
        .int( 'Debe ser un entero.' )
        .min( 0, 'No puede ser negativo.' ),
    draftStartDate: z.string().min( 1, 'Fecha obligatoria.' ),
    draftEndDate: z.string().min( 1, 'Fecha obligatoria.' ),
    startDate: z.string().min( 1, 'Fecha obligatoria.' ),
    endDate: z.string().min( 1, 'Fecha obligatoria.' ),
    dailyStartHour: z
        .number( { error: 'Debe ser un número.' } )
        .int( 'Debe ser un entero.' )
        .min( 0, 'Mínimo 0.' )
        .max( 23, 'Máximo 23.' ),
    dailyEndHour: z
        .number( { error: 'Debe ser un número.' } )
        .int( 'Debe ser un entero.' )
        .min( 0, 'Mínimo 0.' )
        .max( 23, 'Máximo 23.' ),
    }).refine((d) => new Date(d.draftEndDate) >= new Date(d.draftStartDate), {
        message: 'La fecha fin debe ser posterior a la de inicio.',
        path: ['draftEndDate'],
    }).refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
        message: 'La fecha fin debe ser posterior a la de inicio.',
        path: ['endDate'],
    }).refine((d) => d.dailyEndHour > d.dailyStartHour, {
        message: 'La hora fin debe ser mayor que la de inicio.',
        path: ['dailyEndHour'],
    }
);

export type ProcessConfigFormValues = z.infer<typeof processConfigSchema>;
