import Group from "../../database/models/group.model.js";
import GroupMember from "../../database/models/groupMember.model.js";
import GroupRequest from "../../database/models/groupRequest.model.js";

const MAX_GROUP_SIZE = 3;

/* ─── helper ─────────────────────────────────────────────── */
const updateGroupStatus = async (groupId) => {
  const count = await GroupMember.countDocuments({ group: groupId });
  const status = count >= MAX_GROUP_SIZE ? "pending_supervisor" : "forming";
  await Group.findByIdAndUpdate(groupId, { status });
};

/* ─────────────────────────────────────────────────────────────
   POST /api/groups/request/:receiverId
   Anyone can invite anyone, UNLESS:
     - same person
     - a pending request already exists between them (either direction)
     - both are already in groups
     - receiver's group is already full (no point inviting)
   ───────────────────────────────────────────────────────────── */
export const sendGroupRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.params;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: "Cannot invite yourself" });
    }

    // duplicate pending check (either direction)
    const duplicate = await GroupRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId, status: "pending" },
        { sender: receiverId, receiver: senderId, status: "pending" },
      ],
    });
    if (duplicate) {
      return res
        .status(400)
        .json({ message: "A pending request already exists between you two" });
    }

    const [senderMember, receiverMember] = await Promise.all([
      GroupMember.findOne({ student: senderId }),
      GroupMember.findOne({ student: receiverId }),
    ]);

    // both already in groups → block
    if (senderMember && receiverMember) {
      return res.status(400).json({ message: "Both are already in groups" });
    }

    // receiver is in a group → check if that group has room
    if (receiverMember) {
      const count = await GroupMember.countDocuments({
        group: receiverMember.group,
      });
      if (count >= MAX_GROUP_SIZE) {
        return res
          .status(400)
          .json({ message: "Receiver's group is already full" });
      }
    }

    // sender is in a group → check if that group has room
    if (senderMember) {
      const count = await GroupMember.countDocuments({
        group: senderMember.group,
      });
      if (count >= MAX_GROUP_SIZE) {
        return res.status(400).json({ message: "Your group is already full" });
      }
    }

    const request = await GroupRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
      // group intentionally null here; set on accept
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    console.error("sendGroupRequest:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ─────────────────────────────────────────────────────────────
   POST /api/groups/accept/:requestId
   Cases:
     A) neither in a group  → create new group, add both
     B) sender in a group   → receiver joins sender's group
     C) receiver in a group → sender joins receiver's group
   Re-check capacity before every insert.
   ───────────────────────────────────────────────────────────── */
export const acceptRequest = async (req, res) => {
  try {
    const request = await GroupRequest.findById(req.params.requestId);

    if (!request || request.status !== "pending") {
      return res
        .status(404)
        .json({ message: "Invalid or already handled request" });
    }

    // must be the receiver
    if (request.receiver.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorised to accept this request" });
    }

    const { sender: senderId, receiver: receiverId } = request;

    const [senderMember, receiverMember] = await Promise.all([
      GroupMember.findOne({ student: senderId }),
      GroupMember.findOne({ student: receiverId }),
    ]);

    let targetGroupId;

    /* CASE A: neither in a group → create one */
    if (!senderMember && !receiverMember) {
      const group = await Group.create({
        name: `Group-${Date.now()}`,
        createdBy: senderId,
        status: "forming",
      });
      targetGroupId = group.id;

      await GroupMember.insertMany([
        { group: targetGroupId, student: senderId, role: "leader" },
        { group: targetGroupId, student: receiverId, role: "member" },
      ]);
    } else if (senderMember && !receiverMember) {
      /* CASE B: sender already in a group → receiver joins it */
      targetGroupId = senderMember.group;

      const count = await GroupMember.countDocuments({ group: targetGroupId });
      if (count >= MAX_GROUP_SIZE) {
        return res
          .status(400)
          .json({ message: "Sender's group is now full, cannot join" });
      }

      await GroupMember.create({
        group: targetGroupId,
        student: receiverId,
        role: "member",
      });
    } else if (!senderMember && receiverMember) {
      /* CASE C: receiver already in a group → sender joins it */
      targetGroupId = receiverMember.group;

      const count = await GroupMember.countDocuments({ group: targetGroupId });
      if (count >= MAX_GROUP_SIZE) {
        return res
          .status(400)
          .json({ message: "Your group is now full, cannot add sender" });
      }

      await GroupMember.create({
        group: targetGroupId,
        student: senderId,
        role: "member",
      });
    } else {
      /* CASE D: both somehow ended up in groups between send and accept */
      request.status = "rejected";
      await request.save();
      return res.status(400).json({
        message: "Both parties are now in groups; request auto-rejected",
      });
    }

    request.status = "accepted";
    request.group = targetGroupId;
    await request.save();

    await updateGroupStatus(targetGroupId);

    res.json({
      success: true,
      message: "Request accepted",
      groupId: targetGroupId,
    });
  } catch (err) {
    console.error("acceptRequest:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ─────────────────────────────────────────────────────────────
   POST /api/groups/reject/:requestId
   ───────────────────────────────────────────────────────────── */
export const rejectRequest = async (req, res) => {
  try {
    const request = await GroupRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorised" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already handled" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─────────────────────────────────────────────────────────────
   POST /api/groups/:groupId/invite/:studentId
   Group leader invites a specific student who is not yet in any group.
   ───────────────────────────────────────────────────────────── */
export const inviteMember = async (req, res) => {
  try {
    const { groupId, studentId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // only the leader can invite
    const leaderMember = await GroupMember.findOne({
      group: groupId,
      student: req.user.id,
      role: "leader",
    });
    if (!leaderMember) {
      return res
        .status(403)
        .json({ message: "Only the group leader can invite" });
    }

    const memberCount = await GroupMember.countDocuments({ group: groupId });
    if (memberCount >= MAX_GROUP_SIZE) {
      return res.status(400).json({ message: "Group is already full" });
    }

    const alreadyInGroup = await GroupMember.findOne({ student: studentId });
    if (alreadyInGroup) {
      return res.status(400).json({ message: "Student is already in a group" });
    }

    // duplicate pending invite check
    const duplicate = await GroupRequest.findOne({
      sender: req.user.id,
      receiver: studentId,
      group: groupId,
      status: "pending",
    });
    if (duplicate) {
      return res
        .status(400)
        .json({ message: "Invite already sent to this student" });
    }

    const request = await GroupRequest.create({
      sender: req.user.id,
      receiver: studentId,
      group: groupId,
      status: "pending",
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─────────────────────────────────────────────────────────────
   GET /api/groups/my
   ───────────────────────────────────────────────────────────── */
export const getMyGroup = async (req, res) => {
  try {
    const membership = await GroupMember.findOne({
      student: req.user.id,
    }).populate("group");

    if (!membership) {
      return res.json({ group: null, members: [] });
    }

    const members = await GroupMember.find({
      group: membership.group.id,
    }).populate("student", "name email");

    res.json({ group: membership.group, members });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ─────────────────────────────────────────────────────────────
   GET /api/groups/requests/incoming
   ───────────────────────────────────────────────────────────── */
export const getIncomingRequests = async (req, res) => {
  try {
    const requests = await GroupRequest.find({
      receiver: req.user.id,
      status: "pending",
    }).populate("sender", "name email");

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
