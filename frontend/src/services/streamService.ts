// services/stream.service.ts
import api from "./api"; // your existing axios instance

// ── Announcements ──────────────────────────────────────────────

export const fetchAnnouncements = (projectId: string) =>
  api.get(`/projects/${projectId}/announcements`).then((r) => r.data.data);

export const postAnnouncement = (
  projectId: string,
  payload: { title: string; body: string },
) =>
  api
    .post(`/projects/${projectId}/announcements`, payload)
    .then((r) => r.data.data);

export const removeAnnouncement = (projectId: string, id: string) =>
  api.delete(`/projects/${projectId}/announcements/${id}`);

// ── Materials ──────────────────────────────────────────────────

export const fetchMaterials = (projectId: string) =>
  api.get(`/projects/${projectId}/materials`).then((r) => r.data.data);

export const postMaterial = (
  projectId: string,
  payload: { title: string; fileUrl: string },
) =>
  api
    .post(`/projects/${projectId}/materials`, payload)
    .then((r) => r.data.data);

export const removeMaterial = (projectId: string, id: string) =>
  api.delete(`/projects/${projectId}/materials/${id}`);

// ── Assignments ────────────────────────────────────────────────

export const fetchAssignments = (projectId: string) =>
  api.get(`/projects/${projectId}/assignments`).then((r) => r.data.data);

export const fetchAssignmentDetail = (
  projectId: string,
  assignmentId: string,
) =>
  api
    .get(`/projects/${projectId}/assignments/${assignmentId}`)
    .then((r) => r.data.data);

export const postAssignment = (
  projectId: string,
  payload: {
    title: string;
    description?: string;
    dueDate?: string;
    attachments?: { fileName: string; fileUrl: string }[];
  },
) =>
  api
    .post(`/projects/${projectId}/assignments`, payload)
    .then((r) => r.data.data);

export const removeAssignment = (projectId: string, id: string) =>
  api.delete(`/projects/${projectId}/assignments/${id}`);

export const submitAssignment = (
  projectId: string,
  assignmentId: string,
  payload: { content?: string; attachments?: { fileUrl: string }[] },
) =>
  api
    .post(`/projects/${projectId}/assignments/${assignmentId}/submit`, payload)
    .then((r) => r.data.data);

export const fetchSubmissions = (projectId: string, assignmentId: string) =>
  api
    .get(`/projects/${projectId}/assignments/${assignmentId}/submissions`)
    .then((r) => r.data.data);
