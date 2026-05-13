// src/services/profileService.ts
import api from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BaseProfile {
  id: string;
  name: string;
  email: string;
  role: "student" | "supervisor" | "coordinator";
  isActive: boolean;
  department: string | null;
  phone: string | null;
  address: string | null;
}

export interface StudentProfile extends BaseProfile {
  role: "student";
  rollNumber: string | null;
  gpa: number | null;
  batchYear: number | null;
  interests: string[];
}

export interface SupervisorProfile extends BaseProfile {
  role: "supervisor";
  designation: string | null;
  specialization: string | null;
  interests: string[];
  workload: number;
}

export interface CoordinatorProfile extends BaseProfile {
  role: "coordinator";
}

export type Profile = StudentProfile | SupervisorProfile | CoordinatorProfile;

// ─── API Calls ────────────────────────────────────────────────────────────────

// Get logged-in user's profile
export const fetchProfile = async (): Promise<Profile> => {
  const res = await api.get("/profile");
  return res.data.data;
};

// Update logged-in user's profile
export const updateProfile = async (
  data: Partial<Profile>,
): Promise<Profile> => {
  const res = await api.put("/profile", data);
  return res.data.data;
};

// Reset password
export const resetPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const res = await api.put("/profile/reset-password", data);
  return {
    message: res.data.message,
  };
};

// Create student profile
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

// Create supervisor profile
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
