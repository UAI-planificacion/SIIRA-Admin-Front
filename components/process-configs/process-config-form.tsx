'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CalendarClock, Settings2, Clock, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  processConfigSchema,
  type ProcessConfigFormValues,
} from '@/lib/validations/process-config';
import {
  PROCESS_STATUS_LABELS,
  type ProcessConfig,
  type ProcessStatus,
} from '@/types/process-config';

const STATUS_VALUES = Object.keys(PROCESS_STATUS_LABELS) as ProcessStatus[];

function toLocalInput(dateIso: string) {
  const d = new Date(dateIso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export type ProcessConfigFormSubmit = (values: ProcessConfigFormValues) => void;

interface ProcessConfigFormProps {
  initialData?: ProcessConfig;
  onSubmit: ProcessConfigFormSubmit;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function ProcessConfigForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = 'Guardar',
}: ProcessConfigFormProps) {
  const form = useForm<ProcessConfigFormValues>({
    resolver: zodResolver(processConfigSchema),
    defaultValues: {
      academicPeriod: initialData?.academicPeriod ?? '',
      status: initialData?.status ?? 'PENDING',
      totalRealStudents: initialData?.totalRealStudents ?? 0,
      draftStartDate: initialData
        ? toLocalInput(initialData.draftStartDate)
        : '',
      draftEndDate: initialData ? toLocalInput(initialData.draftEndDate) : '',
      startDate: initialData ? toLocalInput(initialData.startDate) : '',
      endDate: initialData ? toLocalInput(initialData.endDate) : '',
      dailyStartHour: initialData?.dailyStartHour ?? 9,
      dailyEndHour: initialData?.dailyEndHour ?? 14,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Periodo y estado */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Settings2 className="h-4 w-4" />
            Configuración general
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="academicPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periodo académico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="2026-02"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Formato AAAA-MM. Debe ser único.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_VALUES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {PROCESS_STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="totalRealStudents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total de alumnos real</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === '' ? 0 : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormDescription>
                  Cantidad real de alumnos del proceso.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Fechas de borrador */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <CalendarClock className="h-4 w-4" />
            Etapa de borrador
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="draftStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de inicio</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="draftEndDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de fin</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Fechas de toma de ramos */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Users className="h-4 w-4" />
            Toma de ramos
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de inicio</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de fin</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Horario diario */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Clock className="h-4 w-4" />
            Horario diario
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="dailyStartHour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de inicio (0-23)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? 0 : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dailyEndHour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de fin (0-23)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? 0 : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
