import SupervisorProfile from "../../database/models/supervisorProfile.model.js";
import UserProfile from "../../database/models/userProfile.model.js";

export const createSupervisorProfile = async (req, res) => {
  try {
    const {
      designation,
      specialization,
      interests,
      department,
      phone,
      address,
    } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const [profile, userProfile] = await Promise.all([
      SupervisorProfile.create({
        user: userId,
        designation,
        specialization,
        interests,
      }),
      UserProfile.create({ user: userId, department, phone, address }),
    ]);

    return res.status(201).json({ success: true, profile, userProfile });
  } catch (err) {
    console.error("CREATE SUPERVISOR PROFILE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
