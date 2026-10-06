import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, FolderKanban, Loader2, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { createProjectRequest, deleteProjectRequest, getProjectsRequest, updateProjectRequest, type Project, type ProjectDTO } from '@/services/project.service';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProjectsRequest();
      setProjects(response.data.filter((project) => project.status !== 'deleted'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los proyectos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(fetchProjects); }, [fetchProjects]);

  const saveProject = async (data: ProjectDTO) => {
    if (projectToEdit) {
      const response = await updateProjectRequest(projectToEdit.id, data);
      setProjects((items) => items.map((item) => item.id === projectToEdit.id ? response.data : item));
      toast.success('Proyecto actualizado.');
    } else {
      const response = await createProjectRequest(data);
      setProjects((items) => [response.data, ...items]);
      toast.success('Proyecto creado.');
    }
    setProjectToEdit(null);
  };

  const removeProject = async (project: Project) => {
    await deleteProjectRequest(project.id);
    setProjects((items) => items.filter((item) => item.id !== project.id));
    toast.success('Proyecto eliminado.');
  };

  const openCreateForm = () => { setProjectToEdit(null); setIsFormOpen(true); };
  const openEditForm = (project: Project) => { setProjectToEdit(project); setIsFormOpen(true); };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <button type="button" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600"><FolderKanban className="h-5 w-5" /></span>
            Task<span className="text-indigo-400">Flow</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block"><p className="text-sm font-medium text-slate-200">{user?.name}</p><p className="text-xs text-slate-400">{user?.email}</p></div>
            <Button variant="outline" size="sm" onClick={logout}>Cerrar sesión</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="mb-2 text-sm font-medium text-indigo-300">Tu espacio de trabajo</p><h1 className="text-3xl font-bold text-white">Proyectos</h1><p className="mt-2 max-w-xl text-sm text-slate-400">Organiza tu trabajo por proyectos y administra las tareas de cada uno.</p></div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void fetchProjects()} disabled={isLoading} className="gap-2"><RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />Actualizar</Button>
            <Button onClick={openCreateForm} className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"><Plus className="h-4 w-4" />Nuevo proyecto</Button>
          </div>
        </div>

        {isLoading && <div className="flex min-h-56 items-center justify-center gap-3 text-slate-400"><Loader2 className="h-6 w-6 animate-spin text-indigo-400" />Cargando proyectos...</div>}
        {!isLoading && error && <div role="alert" className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-8 text-center"><AlertCircle className="mx-auto h-9 w-9 text-rose-400" /><h2 className="mt-3 text-lg font-semibold text-rose-200">No se pudieron cargar los proyectos</h2><p className="mt-2 text-sm text-rose-300">{error}</p><Button variant="outline" onClick={() => void fetchProjects()} className="mt-4">Reintentar</Button></div>}
        {!isLoading && !error && projects.length === 0 && <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-16 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300"><FolderKanban className="h-7 w-7" /></div><h2 className="mt-4 text-lg font-semibold text-slate-100">Aún no tienes proyectos</h2><p className="mx-auto mt-2 max-w-md text-sm text-slate-400">Crea tu primer proyecto para empezar a organizar tareas relacionadas.</p><Button onClick={openCreateForm} className="mt-5 gap-2 bg-indigo-600 text-white hover:bg-indigo-500"><Plus className="h-4 w-4" />Crear proyecto</Button></div>}
        {!isLoading && !error && projects.length > 0 && <><p className="mb-4 text-sm text-slate-400">{projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'}</p><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} onSelect={(item) => navigate(`/dashboard/projects/${item.id}`)} onEdit={openEditForm} onDelete={removeProject} />)}</div></>}
      </main>

      <ProjectForm key={isFormOpen ? projectToEdit?.id ?? 'new-project' : 'closed'} open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setProjectToEdit(null); }} onSubmit={saveProject} project={projectToEdit} />
    </div>
  );
}
