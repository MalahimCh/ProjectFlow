import GroupMember from "../../database/models/groupMember.model.js";
import GroupRequest from "../../database/models/groupRequest.model.js";
import SupervisorRequest from "../../database/models/supervisorRequest.model.js";

export const getInitDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // ─── Default values (EMPTY STATE SAFE) ────────────────────────────────
    let groupId = null;
    let members = [];
    let supervisorRequest = null;
    let pendingRequests = 0;

    // ─── Check if user is in a group ─────────────────────────────────────
    const userMembership = await GroupMember.findOne({
      student: userId,
    });

    // ─── If user belongs to a group, fetch all related data ──────────────
    if (userMembership) {
      groupId = userMembership.group;

      // Get all group members
      members = await GroupMember.find({
        group: groupId,
      }).populate("student", "name reg");

      // Supervisor request
      supervisorRequest = await SupervisorRequest.findOne({
        group: groupId,
      }).populate("supervisor", "name");

      // Pending requests count
      pendingRequests = await GroupRequest.countDocuments({
        group: groupId,
        status: "pending",
      });
    }

    // ─── Build response (ALWAYS RETURN DASHBOARD) ────────────────────────
    const response = {
      stats: {
        pendingRequests,
      },

      group: {
        maxMembers: 3,
        members: members.map((m) => ({
          id: m.student?._id,
          name: m.student?.name,
          reg: m.student?.reg,
          isLeader: m.role === "leader",
        })),
      },

      supervisor: supervisorRequest
        ? {
            status: supervisorRequest.status,
            name: supervisorRequest.supervisor?.name,
            requestedOn: supervisorRequest.createdAt,
            acceptedOn:
              supervisorRequest.status === "accepted"
                ? supervisorRequest.updatedAt
                : null,
          }
        : {
            status: "none",
          },
    };

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
