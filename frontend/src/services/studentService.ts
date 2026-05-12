import api from "./api";

export const getInitDashboard = async () => {
  const res = await api.get("/student/init-dashboard");
  return res.data.data;
};

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
    department: s.department, // ✅ MUST PASS
    designation: s.designation,
    specialization: s.specialization,
    interests: s.interests || [],
    workload: s.workload,
    maxLoad: s.maxLoad,
  }));
};
