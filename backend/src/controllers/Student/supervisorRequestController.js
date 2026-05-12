import SupervisorRequest from "../../database/models/supervisorRequest.model.js";
import Group from "../../database/models/group.model.js";
import GroupMember from "../../database/models/groupMember.model.js";
import SupervisorProfile from "../../database/models/supervisorProfile.model.js";

export const sendSupervisorRequest = async (req, res) => {
  try {
    const { groupId, supervisorId, message, fypName, fypDescription } =
      req.body; // ✅ destructure new fields

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isMember = await GroupMember.findOne({
      group: groupId,
      student: req.user.id,
    });
    if (!isMember)
      return res
        .status(403)
        .json({ message: "You are not a member of this group" });

    const existing = await SupervisorRequest.findOne({
      group: groupId,
      supervisor: supervisorId,
      status: "pending",
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "Request already sent to this supervisor" });

    const profile = await SupervisorProfile.findById(supervisorId);
    if (!profile)
      return res.status(404).json({ message: "Supervisor profile not found" });

    const request = await SupervisorRequest.create({
      group: groupId,
      supervisor: profile.user,
      message,
      fypName, // ✅
      fypDescription, // ✅
    });

    return res
      .status(201)
      .json({ message: "Request sent successfully", data: request });
  } catch (error) {
    console.error("SEND SUPERVISOR REQUEST ERROR:", error);
    return res
      .status(500)
      .json({ message: "Error sending request", error: error.message });
  }
};
