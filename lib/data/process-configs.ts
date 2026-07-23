import { ulid } from 'ulid';
import type { ProcessConfig, ProcessConfigInput } from '@/types/process-config';

const now = () => new Date().toISOString();

const seed: ProcessConfig[] = [
  {
    id: ulid(),
    academicPeriod: '2026-01',
    status: 'COMPLETED',
    totalRealStudents: 1240,
    draftStartDate: '2026-01-05T09:00:00.000Z',
    draftEndDate: '2026-01-10T18:00:00.000Z',
    startDate: '2026-01-15T09:00:00.000Z',
    endDate: '2026-01-20T18:00:00.000Z',
    dailyStartHour: 9,
    dailyEndHour: 14,
    createdAt: '2025-12-01T12:00:00.000Z',
    updatedAt: '2026-01-20T18:00:00.000Z',
  },
  {
    id: ulid(),
    academicPeriod: '2026-02',
    status: 'ACTIVE',
    totalRealStudents: 980,
    draftStartDate: '2026-07-01T09:00:00.000Z',
    draftEndDate: '2026-07-05T18:00:00.000Z',
    startDate: '2026-07-10T09:00:00.000Z',
    endDate: '2026-07-15T18:00:00.000Z',
    dailyStartHour: 9,
    dailyEndHour: 13,
    createdAt: '2026-06-01T12:00:00.000Z',
    updatedAt: '2026-07-10T09:00:00.000Z',
  },
  {
    id: ulid(),
    academicPeriod: '2026-03',
    status: 'PENDING',
    totalRealStudents: 0,
    draftStartDate: '2026-10-01T09:00:00.000Z',
    draftEndDate: '2026-10-05T18:00:00.000Z',
    startDate: '2026-10-10T09:00:00.000Z',
    endDate: '2026-10-15T18:00:00.000Z',
    dailyStartHour: 10,
    dailyEndHour: 15,
    createdAt: '2026-09-01T12:00:00.000Z',
    updatedAt: '2026-09-01T12:00:00.000Z',
  },
];

class ProcessConfigStore {
  private configs: ProcessConfig[] = [...seed];

  list(): ProcessConfig[] {
    return [...this.configs].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }

  get(id: string): ProcessConfig | undefined {
    return this.configs.find((c) => c.id === id);
  }

  create(input: ProcessConfigInput): ProcessConfig {
    const config: ProcessConfig = {
      ...input,
      id: ulid(),
      createdAt: now(),
      updatedAt: now(),
    };
    this.configs.push(config);
    return config;
  }

  update(id: string, input: ProcessConfigInput): ProcessConfig | undefined {
    const idx = this.configs.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    const updated: ProcessConfig = {
      ...this.configs[idx],
      ...input,
      updatedAt: now(),
    };
    this.configs[idx] = updated;
    return updated;
  }

  delete(id: string): boolean {
    const before = this.configs.length;
    this.configs = this.configs.filter((c) => c.id !== id);
    return this.configs.length < before;
  }

  existsByAcademicPeriod(academicPeriod: string, excludeId?: string): boolean {
    return this.configs.some(
      (c) => c.academicPeriod === academicPeriod && c.id !== excludeId
    );
  }
}

// Use global to persist across hot reloads in dev
const globalStore = globalThis as unknown as {
  __processConfigStore?: ProcessConfigStore;
};

export const store =
  globalStore.__processConfigStore ?? new ProcessConfigStore();

if (!globalStore.__processConfigStore) {
  globalStore.__processConfigStore = store;
}
