import api from "./api";

export const getRollNumber = async () => {
  const res = await api.get("/auth/roll-number");
  return res.data.data.rollNumber;
};

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

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);

  const accessToken = res.data.data.accessToken;
  const user = res.data.data.user;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return res.data;
};

export const getUser = async () => {
  const email = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!).email
    : null;
  const res = await api.get("/auth/me", { params: { email } });
  return res.data.data.userR;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};
