import api from "./api";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await api.post("/auth/register", data);
  console.log("Registration response:", res.data);

  const accessToken = res.data.data.accessToken;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  return res.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);

  const accessToken = res.data.data.accessToken;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  console.log("Login response:", res.data);
  return res.data.data.user.role;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("accessToken");
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data.data.user;
};