import SupervisorProfile from "../../database/models/supervisorProfile.model.js";

export const createSupervisorProfile = async (req, res) => {
  try {
    const { designation, maxWorkload, interests } = req.body;

    const profile = await SupervisorProfile.create({
      user: req.user._id,
      designation,
      maxWorkload,
      interests,
    });

    return res.status(201).json({
      success: true,
      profile,
    });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};
