import SupervisorProfile from "../../database/models/supervisorProfile.model.js";
import UserProfile from "../../database/models/userProfile.model.js";

export const getAllSupervisors = async (req, res) => {
  try {
    const profiles = await SupervisorProfile.find()
      .populate({
        path: "user",
        select: "name email role",
      })
      .lean();

    // 🔥 STEP 1: get all user ids
    const userIds = profiles.map((p) => p.user?._id);

    // 🔥 STEP 2: fetch all profiles in one go
    const userProfiles = await UserProfile.find({
      user: { $in: userIds },
    }).lean();

    // 🔥 STEP 3: map for fast lookup
    const profileMap = new Map();
    userProfiles.forEach((up) => {
      profileMap.set(up.user.toString(), up);
    });

    // 🔥 STEP 4: merge
    const formatted = profiles.map((p) => {
      const up = profileMap.get(p.user?._id?.toString());

      return {
        id: p._id,
        name: p.user?.name || "Unknown",
        email: p.user?.email || "",
        department: up?.department || "Not set", // ✅ HERE IT IS
        designation: p.designation || "",
        specialization: p.specialization
          ? p.specialization.split(",").map((s) => s.trim())
          : [],
        interests: p.interests || [],
        workload: p.workload ?? 0,
        maxLoad: 4,
      };
    });

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch supervisors",
    });
  }
};
