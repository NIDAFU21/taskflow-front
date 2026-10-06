import { apiFetch } from './api';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt?: string;
}

export interface TaskPage {
  items: Task[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CreateTaskDTO {
  title: string;
  description: string;
}

export type UpdateTaskDTO = CreateTaskDTO;

export function getTasksRequest(projectId: string, page = 1, limit = 50) {
  return apiFetch<TaskPage>(
    `/tasks/${encodeURIComponent(projectId)}?page=${page}&limit=${limit}`
  );
}

export function createTaskRequest(projectId: string, taskData: CreateTaskDTO) {
  return apiFetch<Task>(`/tasks/${encodeURIComponent(projectId)}`, {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

export function updateTaskRequest(
  projectId: string,
  id: string,
  taskData: UpdateTaskDTO
) {
  return apiFetch<Task>(`/tasks/${encodeURIComponent(projectId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ id, ...taskData }),
  });
}

export function deleteTaskRequest(projectId: string, id: string) {
  return apiFetch<null>(`/tasks/${encodeURIComponent(projectId)}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

export function completeTaskRequest(projectId: string, id: string) {
  return apiFetch<Task>(
    `/tasks/${encodeURIComponent(projectId)}/complete`,
    { method: 'PATCH', body: JSON.stringify({ id }) }
  );
}

export function pendingTaskRequest(projectId: string, id: string) {
  return apiFetch<Task>(`/tasks/${encodeURIComponent(projectId)}/pending`, {
    method: 'PATCH',
    body: JSON.stringify({ id }),
  });
}
