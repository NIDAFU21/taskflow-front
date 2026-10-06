import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  completeTaskRequest,
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  pendingTaskRequest,
  updateTaskRequest,
  type CreateTaskDTO,
  type Task,
  type UpdateTaskDTO,
} from '@/services/task.service';

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const firstPage = await getTasksRequest(projectId, 1);
      const allTasks = [...firstPage.data.items];
      for (let page = 2; page <= firstPage.data.pagination.totalPages; page += 1) {
        const response = await getTasksRequest(projectId, page);
        allTasks.push(...response.data.items);
      }
      setTasks(allTasks);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudieron cargar las tareas.';
      setError(message);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void Promise.resolve().then(fetchTasks);
  }, [fetchTasks]);

  const addTask = async (data: CreateTaskDTO) => {
    const response = await createTaskRequest(projectId, data);
    setTasks((current) => [response.data, ...current]);
    toast.success('Tarea creada.');
    return response.data;
  };

  const toggleTask = async (id: string) => {
    const current = tasks.find((task) => task.id === id);
    if (!current) return;
    const response = current.completed
      ? await pendingTaskRequest(projectId, id)
      : await completeTaskRequest(projectId, id);
    setTasks((items) => items.map((task) => task.id === id ? response.data : task));
    toast.success(response.data.completed ? 'Tarea completada.' : 'Tarea marcada como pendiente.');
  };

  const editTask = async (id: string, data: UpdateTaskDTO) => {
    const response = await updateTaskRequest(projectId, id, data);
    setTasks((items) => items.map((task) => task.id === id ? response.data : task));
    toast.success('Tarea actualizada.');
    return response.data;
  };

  const removeTask = async (id: string) => {
    await deleteTaskRequest(projectId, id);
    setTasks((items) => items.filter((task) => task.id !== id));
    toast.success('Tarea eliminada.');
  };

  return { tasks, isLoading, error, fetchTasks, addTask, toggleTask, editTask, removeTask };
}
