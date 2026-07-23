'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createProcessConfig,
  deleteProcessConfig,
  fetchProcessConfigs,
  updateProcessConfig,
} from '@/lib/api/process-configs';
import type {
  ProcessConfig,
  ProcessConfigInput,
} from '@/types/process-config';

export const PROCESS_CONFIGS_KEY = ['process-configs'] as const;

export function useProcessConfigs() {
  return useQuery({
    queryKey: PROCESS_CONFIGS_KEY,
    queryFn: fetchProcessConfigs,
  });
}

export function useCreateProcessConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProcessConfigInput) => createProcessConfig(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROCESS_CONFIGS_KEY }),
  });
}

export function useUpdateProcessConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: ProcessConfigInput;
    }) => updateProcessConfig(id, input),
    onSuccess: (updated: ProcessConfig) => {
      qc.setQueryData<ProcessConfig[]>(PROCESS_CONFIGS_KEY, (old?: ProcessConfig[]) =>
        old ? old.map((c) => (c.id === updated.id ? updated : c)) : old
      );
    },
  });
}

export function useDeleteProcessConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProcessConfig(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROCESS_CONFIGS_KEY }),
  });
}
