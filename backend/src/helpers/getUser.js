import User from "../database/models/user.model.js";
import { ok, serverError } from "../utils/apiResponse.js";
import { getUserGroupStatus } from "../helpers/groupHelper.js";
export const getUser = async (req, res) => {
  try {
    const { email } = req.query;

    // 1. Fetch user with sensitive fields
    const user = await User.findByEmailForAuth(email);
    let userR = "";

    if (user.role === "student") {
      const groupStatus = await getUserGroupStatus(user._id);

      userR =
        groupStatus.isInGroup && groupStatus.isGroupCompleted
          ? "student"
          : "istudent";
    }

    if (user.role === "supervisor") {
      userR = "supervisor";
    }

    if (user.role === "coordinator") {
      userR = "coordinator";
    }
    return ok(res, "User role", {
      userR,
    });
  } catch (err) {
    console.error("login error:", err);
    return serverError(res);
  }
};
