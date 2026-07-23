'use client';

import { LayoutGrid, Table as TableIcon, Plus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProcessConfigCard } from '@/components/process-configs/process-config-card';
import { ProcessConfigTable } from '@/components/process-configs/process-config-table';
import { ProcessConfigDialog } from '@/components/process-configs/process-config-dialog';
import { useProcessConfigs } from '@/hooks/use-process-configs';
import type { ProcessConfig } from '@/types/process-config';

export function ProcessConfigView() {
  const { data, isLoading, isError, error, refetch } = useProcessConfigs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Configuraciones de proceso
          </h1>
          <p className="text-sm text-muted-foreground">
            Administra los periodos académicos de toma de ramos.
          </p>
        </div>
        <ProcessConfigDialog mode="create" />
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Cargando configuraciones...
          </p>
        </div>
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : 'Error al cargar.'}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
          <Plus className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No hay configuraciones. Crea la primera.
          </p>
          <ProcessConfigDialog mode="create" />
        </div>
      ) : (
        <Tabs defaultValue="cards" className="w-full">
          <TabsList>
            <TabsTrigger value="cards">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Tarjetas
            </TabsTrigger>
            <TabsTrigger value="table">
              <TableIcon className="mr-2 h-4 w-4" />
              Tabla
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cards">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((c: ProcessConfig) => (
                <ProcessConfigCard key={c.id} config={c} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="table">
            <ProcessConfigTable configs={data} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
