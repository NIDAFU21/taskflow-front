import { useState } from 'react';
import { ArrowRight, FolderKanban, MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Project } from '@/services/project.service';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => Promise<unknown>;
}

export function ProjectCard({ project, onSelect, onEdit, onDelete }: ProjectCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete(project);
      setConfirmDelete(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el proyecto.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="flex h-full flex-col border-slate-800 bg-slate-900/60 transition-colors hover:border-indigo-500/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-lg bg-indigo-500/10 p-2.5 text-indigo-400"><FolderKanban className="h-5 w-5" /></div>
              <CardTitle className="truncate text-lg text-slate-100">{project.name}</CardTitle>
            </div>
            <span className="rounded-full border border-emerald-800 bg-emerald-950/40 px-2 py-1 text-xs text-emerald-300">Activo</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="line-clamp-3 min-h-14 text-sm leading-6 text-slate-400">{project.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-slate-800/70 pt-4">
          <Button variant="ghost" size="sm" onClick={() => onSelect(project)} className="gap-2 text-indigo-300 hover:text-indigo-200">Abrir tareas <ArrowRight className="h-4 w-4" /></Button>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" aria-label={`Editar ${project.name}`} onClick={() => onEdit(project)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" aria-label={`Eliminar ${project.name}`} onClick={() => setConfirmDelete(true)} className="text-slate-400 hover:text-rose-400"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </CardFooter>
      </Card>
      <Dialog open={confirmDelete} onOpenChange={(open) => !isDeleting && setConfirmDelete(open)}>
        <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-400"><MoreHorizontal className="h-5 w-5" /><DialogTitle className="text-white">Eliminar proyecto</DialogTitle></div>
            <DialogDescription className="text-slate-400">El proyecto se marcará como eliminado. Sus tareas permanecerán guardadas en la base de datos.</DialogDescription>
          </DialogHeader>
          <p className="rounded-lg bg-slate-950 p-3 text-sm font-medium text-slate-200">{project.name}</p>
          {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={isDeleting}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Eliminando...</> : 'Eliminar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
