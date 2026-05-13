import * as profileService from "./profileService.js";

// ─── GET /api/profile ────────────────────────────────────────────────────────
export async function getProfile(req, res, next) {
  try {
    const { id: userId, role } = req.user; // set by auth middleware
    console.log("Fetching profile for userId:", userId, "with role:", role);
    const profile = await profileService.getProfileByRole(userId, role);
    return res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

// ─── PUT /api/profile ────────────────────────────────────────────────────────
export async function updateProfile(req, res, next) {
  try {
    const { id: userId, role } = req.user;
    const updated = await profileService.updateProfileByRole(
      userId,
      role,
      req.body,
    );
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

// ─── PUT /api/profile/reset-password ────────────────────────────────────────
export async function resetPassword(req, res, next) {
  try {
    const { id: userId } = req.user;
    const result = await profileService.resetPassword(userId, req.body);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}
