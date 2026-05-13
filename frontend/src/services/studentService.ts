import api from "./api";

/* ── dashboard ───────────────────────────────────── */
export const getInitDashboard = async () => {
  const res = await api.get("/student/init-dashboard");
  return res.data.data;
};

/* ── discovery ───────────────────────────────────── */
export const getStudentProfiles = async () => {
  const res = await api.get("/student/find-team");
  return res.data.data;
};

export const getSupervisors = async () => {
  const res = await api.get("/student/find-supervisor");
  return res.data.data.map((s: any) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    department: s.department,
    designation: s.designation,
    specialization: s.specialization,
    interests: s.interests || [],
    workload: s.workload,
    maxLoad: s.maxLoad,
  }));
};
/* ── supervisor request ─────────────────────────── */
export const sendSupervisorRequest = async (
  groupId: string,
  supervisorId: string,
  fypName: string,
  fypDescription: string,
  message?: string,
) => {
  const res = await api.post("/student/sendSupervisorRequest", {
    groupId,
    supervisorId,
    fypName,
    fypDescription,
    message,
  });
  return res.data;
};
/* ── group self ──────────────────────────────────── */
export const getMyGroup = async () => {
  const res = await api.get("/student/group/me");
  return res.data; // { group, members }
};

export const getIncomingRequests = async () => {
  const res = await api.get("/student/group/requests/incoming");
  return res.data.data as IncomingRequest[];
};

/* ── group actions ───────────────────────────────── */
export const sendGroupRequest = async (receiverId: string) => {
  const res = await api.post(`/student/group/request/${receiverId}`);
  return res.data;
};

export const acceptGroupRequest = async (requestId: string) => {
  const res = await api.post(`/student/group/accept/${requestId}`);
  return res.data;
};

export const rejectGroupRequest = async (requestId: string) => {
  const res = await api.post(`/student/group/reject/${requestId}`);
  return res.data;
};

export const inviteMember = async (groupId: string, studentId: string) => {
  const res = await api.post(`/student/group/${groupId}/invite/${studentId}`);
  return res.data;
};

/* ── shared types ────────────────────────────────── */
export type IncomingRequest = {
  id: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
};

/* ── Get student's meetings ───────────────────────── */
export const getStudentMeetings = async () => {
  const res = await api.get("meetings/student");
  return res.data?.data ?? { project: null, meetings: [] };
};

/* ── Create meeting ───────────────────────────────── */
export const createStudentMeeting = async (payload: {
  title: string;
  description?: string;
  scheduledAt: string;
  meetingUrl?: string;
}) => {
  const res = await api.post("meetings/student", payload);
  return res.data;
};

/* ── Update meeting ───────────────────────────────── */
export const updateMeeting = async (
  meetingId: string,
  payload: {
    title?: string;
    description?: string;
    scheduledAt?: string;
    meetingUrl?: string;
  },
) => {
  const res = await api.put(`/meetings/${meetingId}`, payload);
  return res.data;
};

/* ── Delete meeting ───────────────────────────────── */
export const deleteMeeting = async (meetingId: string) => {
  const res = await api.delete(`/meetings/${meetingId}`);
  return res.data;
};

export interface DashboardDeadline {
  id: string;
  title: string;
  due: string;
  dueAt: string;
  daysLeft: number;
  type: "global" | "assignment";
  assignmentId?: string;
  projectId?: string;
}

export interface DashboardAnnouncement {
  id: string;
  title: string;
  body: string;
  postedAt: string;
  createdAt: string;
}

export interface DashboardData {
  hasProject: boolean;
  student: { rollNumber: string };
  project: {
    id: string;
    title: string;
    domain: string;
    status: string;
    supervisor: string;
    supervisorEmail: string;
    team: string[];
    progress: number;
  } | null;
  stats: {
    progress: number;
    pendingTasks: number;
    meetings: number;
  };
  deadlines: DashboardDeadline[];
  announcements: DashboardAnnouncement[];
}

export const fetchStudentDashboard = (): Promise<DashboardData> =>
  api.get("/student/dashboard").then((r) => r.data.data);

// frontend usage
export const getStudentProjectId = async (): Promise<string> => {
  const res = await api.get("/student/project-id");
  console.log(res);
  return res.data.data.projectId;
};
