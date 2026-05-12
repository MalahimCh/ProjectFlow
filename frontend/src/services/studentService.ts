import api from "./api";

export const getInitDashboard = async () => {
  const res = await api.get("/student/init-dashboard");
  return res.data.data;
};

export const getStudentProfiles = async () => {
  const res = await api.get("/student/find-team");
  return res.data.data;
};
