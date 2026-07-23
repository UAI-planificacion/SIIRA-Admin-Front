import type {
  ProcessConfig,
  ProcessConfigInput,
} from '@/types/process-config';

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.message ?? 'Ocurrió un error inesperado.';
  } catch {
    return 'Ocurrió un error inesperado.';
  }
}

export async function fetchProcessConfigs(): Promise<ProcessConfig[]> {
  const res = await fetch('/api/process-configs');
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createProcessConfig(
  input: ProcessConfigInput
): Promise<ProcessConfig> {
  const res = await fetch('/api/process-configs/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateProcessConfig(
  id: string,
  input: ProcessConfigInput
): Promise<ProcessConfig> {
  const res = await fetch(`/api/process-configs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function deleteProcessConfig(id: string): Promise<void> {
  const res = await fetch(`/api/process-configs/${id}/delete`, {
    method: 'DELETE',
  });
  if (!res.ok && res.status !== 204) throw new Error(await parseError(res));
}
