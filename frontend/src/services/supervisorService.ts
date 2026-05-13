// services/supervisor.service.ts
import api from "./api";

/* ─────────────────────────────────────────────
   INTERFACES
──────────────────────────────────────────── */

// ── Projects ──
export interface ProjectDeadline {
  type: string;
  dueDate: string;
  time: string;
  daysLeft: number;
}

export interface SupervisedProject {
  id: string;
  title: string;
  description: string;
  domain: string;
  status: string;
  group: {
    id: string;
    name: string;
    memberCount: number;
  } | null;
  supervisor: {
    id: string;
    name: string;
    email: string;
  } | null;
  members: number;
  progress: number;
  deadline: ProjectDeadline | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsStats {
  totalGroups: number;
  totalStudents: number;
  upcomingDeadlines: number;
  laggingGroups: number;
}

export interface SupervisorProjectsData {
  stats: ProjectsStats;
  projects: SupervisedProject[];
}

// ── Dashboard ──
export interface DashboardStats {
  activeGroups: number;
  pendingRequests: number;
  upcomingMeetings: number;
  totalStudents: number;
}

export interface ActiveProject {
  id: string;
  groupName: string;
  projectTitle: string;
  domain: string;
  status: string;
  progress: number;
}

export interface UpcomingDeadline {
  id: string;
  deadlineType: string;
  description: string;
  datetime: string; // ISO string
}

export interface UpcomingMeeting {
  id: string;
  meetingType: string;
  projectName: string;
  projectId: string;
  datetime: string; // ISO string
  meetingUrl: string | null;
  description: string;
}

export interface SupervisorDashboardData {
  stats: DashboardStats;
  activeProjects: ActiveProject[];
  upcomingDeadlines: UpcomingDeadline[];
  upcomingMeetings: UpcomingMeeting[];
}

// ── Meetings ──
export interface CreateMeetingPayload {
  projectId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  meetingUrl?: string;
}

export interface UpdateMeetingPayload {
  title?: string;
  description?: string;
  scheduledAt?: string;
  meetingUrl?: string;
}

/* ─────────────────────────────────────────────
   PROJECTS
──────────────────────────────────────────── */

/**
 * Fetches all supervised projects with stats, deadlines, and progress.
 * Use for the full projects page (includes stats summary).
 */
export const fetchSupervisorProjects = (): Promise<SupervisorProjectsData> =>
  api.get("/supervisor/projects").then((r) => r.data.data);

/**
 * Fetches supervised projects as a plain array.
 * Use for lightweight contexts (e.g. dropdowns, meeting creation).
 */
export const getSupervisorProjects = async (): Promise<SupervisedProject[]> => {
  const res = await api.get("/supervisor/projects");
  return res.data?.data?.projects ?? res.data?.data ?? [];
};

/* ─────────────────────────────────────────────
   DASHBOARD
──────────────────────────────────────────── */

export const fetchSupervisorDashboard = (): Promise<SupervisorDashboardData> =>
  api.get("/supervisor/dashboard").then((r) => r.data.data);

/* ─────────────────────────────────────────────
   REQUESTS
──────────────────────────────────────────── */

export const getSupervisorRequests = async () => {
  const res = await api.get("/supervisor/requests");
  return res.data?.data ?? [];
};

export const acceptSupervisorRequest = async (requestId: string) => {
  const res = await api.put(`/supervisor/accept/${requestId}`);
  return res.data;
};

export const rejectSupervisorRequest = async (requestId: string) => {
  const res = await api.put(`/supervisor/reject/${requestId}`);
  return res.data;
};

/* ─────────────────────────────────────────────
   MEETINGS
──────────────────────────────────────────── */

export const getSupervisorMeetings = async () => {
  const res = await api.get("meetings/supervisor");
  return res.data?.data ?? { projects: [], meetings: [] };
};

export const createSupervisorMeeting = async (
  payload: CreateMeetingPayload,
) => {
  const res = await api.post("meetings/supervisor", payload);
  return res.data;
};

export const updateMeeting = async (
  meetingId: string,
  payload: UpdateMeetingPayload,
) => {
  const res = await api.put(`/meetings/${meetingId}`, payload);
  return res.data;
};

export const deleteMeeting = async (meetingId: string) => {
  const res = await api.delete(`/meetings/${meetingId}`);
  return res.data;
};
