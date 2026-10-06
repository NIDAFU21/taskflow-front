import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, FolderKanban, ListTodo, Loader2, Plus, RefreshCw } from 'lucide-react';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskSkeleton } from '@/components/tasks/TaskSkeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { getProjectRequest, type Project } from '@/services/project.service';
import type { Task } from '@/services/task.service';

export default function ProjectTasksPage() {
  const { projectId = '' } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { tasks, isLoading, error, fetchTasks, addTask, toggleTask, editTask, removeTask } = useTasks(projectId);
  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const fetchProject = useCallback(async () => {
    setProjectLoading(true);
    setProjectError(null);
    try {
      const response = await getProjectRequest(projectId);
      if (response.data.status === 'deleted') throw new Error('Este proyecto fue eliminado.');
      setProject(response.data);
    } catch (err) {
      setProjectError(err instanceof Error ? err.message : 'No se pudo cargar el proyecto.');
    } finally {
      setProjectLoading(false);
    }
  }, [projectId]);

  useEffect(() => { void Promise.resolve().then(fetchProject); }, [fetchProject]);

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <button type="button" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xl font-bold text-white"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600"><FolderKanban className="h-5 w-5" /></span>Task<span className="text-indigo-400">Flow</span></button>
          <div className="flex items-center gap-4"><div className="hidden text-right sm:block"><p className="text-sm font-medium text-slate-200">{user?.name}</p><p className="text-xs text-slate-400">{user?.email}</p></div><Button variant="outline" size="sm" onClick={logout}>Cerrar sesión</Button></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-5 gap-2 text-slate-300"><ArrowLeft className="h-4 w-4" />Todos los proyectos</Button>

        {projectLoading && <div className="flex min-h-40 items-center justify-center gap-3 text-slate-400"><Loader2 className="h-6 w-6 animate-spin text-indigo-400" />Cargando proyecto...</div>}
        {!projectLoading && projectError && <div role="alert" className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-8 text-center"><AlertCircle className="mx-auto h-9 w-9 text-rose-400" /><h1 className="mt-3 text-lg font-semibold text-rose-200">No se pudo abrir el proyecto</h1><p className="mt-2 text-sm text-rose-300">{projectError}</p><Button variant="outline" onClick={() => void fetchProject()} className="mt-4">Reintentar</Button></div>}
        {!projectLoading && !projectError && project && <>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="mb-2 text-sm font-medium text-indigo-300">Proyecto</p><h1 className="text-3xl font-bold text-white">{project.name}</h1><p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm text-slate-400">{project.description}</p></div>
            <div className="flex gap-2"><Button variant="outline" onClick={() => void fetchTasks()} disabled={isLoading} className="gap-2"><RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />Actualizar</Button><Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"><Plus className="h-4 w-4" />Nueva tarea</Button></div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard label="Total de tareas" count={tasks.length} icon={<ListTodo className="h-5 w-5" />} loading={isLoading} />
            <SummaryCard label="Completadas" count={completed} icon={<CheckCircle2 className="h-5 w-5" />} loading={isLoading} tone="green" />
            <SummaryCard label="Pendientes" count={pending} icon={<Clock className="h-5 w-5" />} loading={isLoading} tone="amber" />
          </div>

          {isLoading && <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <TaskSkeleton key={index} />)}</div>}
          {!isLoading && error && <div role="alert" className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-8 text-center"><AlertCircle className="mx-auto h-9 w-9 text-rose-400" /><h2 className="mt-3 font-semibold text-rose-200">No se pudieron cargar las tareas</h2><p className="mt-2 text-sm text-rose-300">{error}</p><Button variant="outline" onClick={() => void fetchTasks()} className="mt-4">Reintentar</Button></div>}
          {!isLoading && !error && tasks.length === 0 && <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-16 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300"><ListTodo className="h-7 w-7" /></div><h2 className="mt-4 text-lg font-semibold text-slate-100">Este proyecto aún no tiene tareas</h2><p className="mt-2 text-sm text-slate-400">Crea la primera tarea para avanzar con este proyecto.</p><Button onClick={() => setIsCreateOpen(true)} className="mt-5 gap-2 bg-indigo-600 text-white hover:bg-indigo-500"><Plus className="h-4 w-4" />Crear tarea</Button></div>}
          {!isLoading && !error && tasks.length > 0 && <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={removeTask} onEdit={setTaskToEdit} />)}</div>}

          <TaskForm open={isCreateOpen} onOpenChange={setIsCreateOpen} onSubmit={addTask} />
          <TaskForm open={Boolean(taskToEdit)} onOpenChange={(open) => { if (!open) setTaskToEdit(null); }} initialData={taskToEdit} onSubmit={async (data) => { if (taskToEdit) await editTask(taskToEdit.id, data); }} />
        </>}
      </main>
    </div>
  );
}

function SummaryCard({ label, count, icon, loading, tone = 'indigo' }: { label: string; count: number; icon: ReactNode; loading: boolean; tone?: 'indigo' | 'green' | 'amber' }) {
  const color = tone === 'green' ? 'text-emerald-400 bg-emerald-500/10' : tone === 'amber' ? 'text-amber-400 bg-amber-500/10' : 'text-indigo-400 bg-indigo-500/10';
  return <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5"><span className={`rounded-lg p-3 ${color}`}>{icon}</span><div><p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>{loading ? <Loader2 className="mt-2 h-6 w-6 animate-spin text-slate-500" /> : <p className="mt-1 text-2xl font-bold text-slate-100">{count}</p>}</div></div>;
}
