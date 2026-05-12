import StudentProfile from "../../database/models/studentProfile.model.js";
import User from "../../database/models/user.model.js";

export const getAllStudentProfiles = async (req, res) => {
  try {
    const profiles = await StudentProfile.find()
      .populate({
        path: "user",
        select: "name email role",
      })
      .lean();

    const formatted = profiles
      .filter((p) => {
        // Skip profiles with no linked user
        if (!p.user) return false;

        // Exclude current logged-in user
        const userId = p.user._id?.toString() || p.user.id;
        return userId !== req.user.id;
      })
      .map((p) => ({
        id: p.user._id?.toString() || p.user.id,
        name: p.user.name || "Unknown",
        rollNo: p.rollNumber,
        cgpa: p.gpa ?? 0,
        interests: p.interests || [],
        batchYear: p.batchYear,
      }));

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    console.error("GET ALL STUDENT PROFILES ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student profiles",
    });
  }
};
