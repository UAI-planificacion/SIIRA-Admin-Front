export type ProcessStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export const PROCESS_STATUS_LABELS: Record<ProcessStatus, string> = {
  PENDING: 'Pendiente',
  ACTIVE: 'Activo',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

export interface ProcessConfig {
  id: string;
  academicPeriod: string;
  status: ProcessStatus;
  totalRealStudents: number;
  draftStartDate: string;
  draftEndDate: string;
  startDate: string;
  endDate: string;
  dailyStartHour: number;
  dailyEndHour: number;
  createdAt: string;
  updatedAt: string;
}

export type ProcessConfigInput = Omit<
  ProcessConfig,
  'id' | 'createdAt' | 'updatedAt'
>;
