/* ── supervisor requests (supervisor side) ───────────────────── */
import api from "./api";

export const getSupervisorRequests = async () => {
  const res = await api.get("/supervisor/requests");
  return res.data.data;
};

export const acceptSupervisorRequest = async (requestId: string) => {
  const res = await api.put(`/supervisor/accept/${requestId}`);
  return res.data;
};

export const rejectSupervisorRequest = async (requestId: string) => {
  const res = await api.put(`/supervisor/reject/${requestId}`);
  return res.data;
};
