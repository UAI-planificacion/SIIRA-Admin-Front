import type { Period } from './periods';

export type ProcessStatus = 'PENDING' | 'PLANNING_STAGE' | 'ENROLLMENT_STAGE' | 'CLOSED';


export const PROCESS_STATUS_LABELS: Record<ProcessStatus, string> = {
    PENDING          : 'Pendiente',
    PLANNING_STAGE   : 'Planificación',
    ENROLLMENT_STAGE : 'Inscripción',
    CLOSED           : 'Cerrado',
};


export interface ProcessConfig {
    id                  : string;
    status              : ProcessStatus;
    totalRealStudents   : number;
    planningStartDate   : string;
    planningEndDate     : string;
    enrollmentStartDate : string;
    enrollmentEndDate   : string;
    createdAt           : string;
    updatedAt           : string;
    period              : Period;
}


export type ProcessConfigInput = Omit<ProcessConfig, 'id' | 'createdAt' | 'updatedAt' | 'period'>;
