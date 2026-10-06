import { apiFetch } from './api';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
}

export interface ProjectDTO {
  name: string;
  description: string;
}

export function getProjectsRequest() {
  return apiFetch<Project[]>('/projects');
}

export function getProjectRequest(id: string) {
  return apiFetch<Project & { tasks?: unknown[] }>(
    `/projects/${encodeURIComponent(id)}`
  );
}

export function createProjectRequest(data: ProjectDTO) {
  return apiFetch<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProjectRequest(id: string, data: ProjectDTO) {
  return apiFetch<Project>(`/projects/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteProjectRequest(id: string) {
  return apiFetch<Project>(`/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
