import api from "./api";

export const createStudentProfile = async (data: {
  rollNumber: string;
  gpa?: number;
  interests?: string[];
  batchYear?: number;
}) => {
  const res = await api.post("/student/student-profile", data);
  return res.data;
};

export const createSupervisorProfile = async (data: {
  designation: string;
  maxWorkload?: number;
  interests?: string[];
}) => {
  const res = await api.post("/supervisor/supervisor-profile", data);
  return res.data;
};
