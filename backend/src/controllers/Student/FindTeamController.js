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

    const formatted = profiles.map((p) => ({
      id: p._id,
      name: p.user?.name || "Unknown",
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
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student profiles",
    });
  }
};
