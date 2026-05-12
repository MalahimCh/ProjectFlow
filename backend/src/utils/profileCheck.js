import StudentProfile from "../database/models/studentProfile.model.js";
import SupervisorProfile from "../database/models/supervisorProfile.model.js";

export const isProfileComplete = async (user) => {
  if (user.role === "student") {
    const profile = await StudentProfile.findOne({ user: user._id });
    return !!profile;
  }

  if (user.role === "supervisor") {
    const profile = await SupervisorProfile.findOne({ user: user._id });
    return !!profile;
  }

  return true; // coordinator assumed complete
};