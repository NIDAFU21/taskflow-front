import { useState, type FormEvent } from 'react';
import { AlertCircle, Loader2, FolderPlus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import type { Project, ProjectDTO } from '@/services/project.service';

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectDTO) => Promise<unknown>;
  project?: Project | null;
}

export function ProjectForm({ open, onOpenChange, onSubmit, project }: ProjectFormProps) {
  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(project);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError('El nombre y la descripción son obligatorios.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el proyecto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-indigo-400">
            {isEditing ? <Pencil className="h-5 w-5" /> : <FolderPlus className="h-5 w-5" />}
            <DialogTitle className="text-white">{isEditing ? 'Editar proyecto' : 'Nuevo proyecto'}</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Los proyectos organizan las tareas relacionadas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div role="alert" className="flex items-center gap-2 rounded-lg border border-rose-800 bg-rose-950/40 p-3 text-sm text-rose-300"><AlertCircle className="h-4 w-4" />{error}</div>}
          <div className="space-y-1.5">
            <label htmlFor="project-name" className="text-sm font-medium text-slate-300">Nombre</label>
            <Input id="project-name" maxLength={255} value={name} onChange={(event) => setName(event.target.value)} placeholder="Sitio web, curso..." disabled={isSubmitting} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="project-description" className="text-sm font-medium text-slate-300">Descripción</label>
            <textarea id="project-description" maxLength={255} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="¿Qué quieres organizar en este proyecto?" disabled={isSubmitting} rows={4} className="flex w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none disabled:opacity-60" />
            <p className="text-right text-xs text-slate-500">{description.length}/255</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || !name.trim() || !description.trim()} className="bg-indigo-600 text-white hover:bg-indigo-500">
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : isEditing ? 'Guardar cambios' : 'Crear proyecto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
