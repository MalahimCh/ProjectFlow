import StudentProfile from "../../database/models/studentProfile.model.js";
import UserProfile from "../../database/models/userProfile.model.js";

export const createStudentProfile = async (req, res) => {
  try {
    const {
      rollNumber,
      gpa,
      interests,
      batchYear,
      department,
      phone,
      address,
    } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const [profile, userProfile] = await Promise.all([
      StudentProfile.create({
        user: userId,
        rollNumber,
        gpa,
        interests,
        batchYear,
      }),
      UserProfile.create({ user: userId, department, phone, address }),
    ]);

    return res.status(201).json({ success: true, profile, userProfile });
  } catch (err) {
    console.error("CREATE STUDENT PROFILE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
