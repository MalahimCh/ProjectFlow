import StudentProfile from "../../database/models/studentProfile.model.js";

export const createStudentProfile = async (req, res) => {
  try {
    const { rollNumber, gpa, interests, batchYear } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found in token",
      });
    }

    const profile = await StudentProfile.create({
      user: userId,
      rollNumber,
      gpa,
      interests,
      batchYear,
    });

    return res.status(201).json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error("CREATE PROFILE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message, // 👈 important for debugging
    });
  }
};
