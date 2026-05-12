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

/* ── supervisor request ─────────────────────────── */
export const sendSupervisorRequest = async (
  groupId: string,
  supervisorId: string,
  message?: string,
) => {
  const res = await api.post("/student/sendSupervisorRequest", {
    groupId,
    supervisorId,
    message,
  });

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
