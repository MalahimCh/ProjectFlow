import bcrypt from "bcryptjs";
import User from "../database/models/user.model.js";
import UserProfile from "../database/models/userProfile.model.js";
import StudentProfile from "../database/models/studentProfile.model.js";
import SupervisorProfile from "../database/models/supervisorProfile.model.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Fetch the shared UserProfile, creating it if it doesn't exist yet.
 */
async function getOrCreateUserProfile(userId) {
  let profile = await UserProfile.findOne({ user: userId });
  if (!profile) {
    profile = await UserProfile.create({ user: userId });
  }
  return profile;
}

// ─── GET profile ─────────────────────────────────────────────────────────────

export async function getProfileByRole(userId, role) {
  const user = await User.findById(userId).lean();
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });

  const userProfile = await getOrCreateUserProfile(userId);

  const base = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    department: userProfile.department ?? null,
    phone: userProfile.phone ?? null,
    address: userProfile.address ?? null,
  };

  if (role === "student") {
    const studentProfile = await StudentProfile.findOne({
      user: userId,
    }).lean();
    return {
      ...base,
      rollNumber: studentProfile?.rollNumber ?? null,
      gpa: studentProfile?.gpa ?? null,
      batchYear: studentProfile?.batchYear ?? null,
      interests: studentProfile?.interests ?? [],
    };
  }

  if (role === "supervisor") {
    const supervisorProfile = await SupervisorProfile.findOne({
      user: userId,
    }).lean();
    return {
      ...base,
      designation: supervisorProfile?.designation ?? null,
      specialization: supervisorProfile?.specialization ?? null,
      interests: supervisorProfile?.interests ?? [],
      workload: supervisorProfile?.workload ?? 0,
    };
  }

  // coordinator — base only
  return base;
}

// ─── UPDATE profile ──────────────────────────────────────────────────────────

export async function updateProfileByRole(userId, role, body) {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });

  // Fields that live on the User document
  const userFields = ["name", "email"];
  const userUpdates = {};
  userFields.forEach((f) => {
    if (body[f] !== undefined) userUpdates[f] = body[f];
  });
  if (Object.keys(userUpdates).length) {
    Object.assign(user, userUpdates);
    await user.save();
  }

  // Fields that live on UserProfile
  const sharedFields = ["department", "phone", "address"];
  const sharedUpdates = {};
  sharedFields.forEach((f) => {
    if (body[f] !== undefined) sharedUpdates[f] = body[f];
  });
  if (Object.keys(sharedUpdates).length) {
    await UserProfile.findOneAndUpdate(
      { user: userId },
      { $set: sharedUpdates },
      { upsert: true, new: true },
    );
  }

  // Role-specific fields
  if (role === "student") {
    const studentFields = ["rollNumber", "gpa", "batchYear", "interests"];
    const studentUpdates = {};
    studentFields.forEach((f) => {
      if (body[f] !== undefined) studentUpdates[f] = body[f];
    });
    if (Object.keys(studentUpdates).length) {
      await StudentProfile.findOneAndUpdate(
        { user: userId },
        { $set: studentUpdates },
        { upsert: true, new: true },
      );
    }
  }

  if (role === "supervisor") {
    const supervisorFields = [
      "designation",
      "specialization",
      "interests",
      "workload",
    ];
    const supervisorUpdates = {};
    supervisorFields.forEach((f) => {
      if (body[f] !== undefined) supervisorUpdates[f] = body[f];
    });
    if (Object.keys(supervisorUpdates).length) {
      await SupervisorProfile.findOneAndUpdate(
        { user: userId },
        { $set: supervisorUpdates },
        { upsert: true, new: true },
      );
    }
  }

  return getProfileByRole(userId, role);
}

// ─── RESET PASSWORD ──────────────────────────────────────────────────────────

export async function resetPassword(userId, { currentPassword, newPassword }) {
  if (!currentPassword || !newPassword) {
    throw Object.assign(
      new Error("currentPassword and newPassword are required"),
      { status: 400 },
    );
  }

  if (newPassword.length < 8) {
    throw Object.assign(
      new Error("newPassword must be at least 8 characters"),
      { status: 400 },
    );
  }

  // Re-select passwordHash (it's excluded by default)
  const user = await User.findById(userId).select("+passwordHash");
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });

  const match = await user.comparePassword(currentPassword);
  if (!match) {
    throw Object.assign(new Error("Current password is incorrect"), {
      status: 401,
    });
  }

  const salt = await bcrypt.genSalt(12);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  // Invalidate all refresh tokens on password change
  user.refreshTokens = [];
  await user.save();

  return { message: "Password updated successfully" };
}
