import api from "./api";

export const createStudentProfile = async (data: {
  rollNumber: string;
  gpa?: number;
  interests?: string[];
  batchYear?: number;
  department?: string;
  phone?: string;
  address?: string;
}) => {
  const res = await api.post("/student/student-profile", data);
  return res.data;
};

export const createSupervisorProfile = async (data: {
  designation: string;
  specialization?: string;
  interests?: string[];
  department?: string;
  phone?: string;
  address?: string;
}) => {
  const res = await api.post("/supervisor/supervisor-profile", data);
  return res.data;
};
