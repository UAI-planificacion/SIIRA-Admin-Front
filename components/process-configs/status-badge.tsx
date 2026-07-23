import { Badge } from '@/components/ui/badge';
import {
  PROCESS_STATUS_LABELS,
  type ProcessStatus,
} from '@/types/process-config';

const STATUS_VARIANTS: Record<
  ProcessStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  PENDING: 'secondary',
  ACTIVE: 'default',
  COMPLETED: 'outline',
  CANCELLED: 'destructive',
};

export function StatusBadge({ status }: { status: ProcessStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      {PROCESS_STATUS_LABELS[status]}
    </Badge>
  );
}
