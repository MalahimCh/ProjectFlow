import GroupMember from "../../database/models/groupMember.model.js";
import GroupRequest from "../../database/models/groupRequest.model.js";
import SupervisorRequest from "../../database/models/supervisorRequest.model.js";
import StudentProfile from "../../database/models/studentProfile.model.js";

export const getInitDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Default values
    let groupId = null;
    let members = [];
    let supervisorRequest = null;
    let pendingRequests = 0;

    // Check whether current student belongs to a group
    const userMembership = await GroupMember.findOne({
      student: userId,
    });

    // If the student is in a group, load related data
    if (userMembership) {
      groupId = userMembership.group;

      // Fetch all members of the group
      members = await GroupMember.find({
        group: groupId,
      })
        .populate("student", "name email")
        .lean();

      // Fetch supervisor request for this group
      supervisorRequest = await SupervisorRequest.findOne({
        group: groupId,
      })
        .populate("supervisor", "name")
        .lean();
    }

    // Count pending invitations sent by this group
    pendingRequests = await GroupRequest.countDocuments({
      group: groupId,
      status: "pending",
    });
    // Build members data with roll number from StudentProfile
    const membersData = await Promise.all(
      members.map(async (member) => {
        const profile = await StudentProfile.findOne({
          user: member.student?._id || member.student?.id,
        })
          .select("rollNumber")
          .lean();

        return {
          id: member.student?._id?.toString() || member.student?.id || null,
          name: member.student?.name || "Unknown",
          reg: profile?.rollNumber || "",
          isLeader: member.role === "leader",
        };
      }),
    );

    const response = {
      stats: {
        pendingRequests,
      },

      group: {
        maxMembers: 3,
        currentMembers: membersData.length,
        members: membersData,
      },

      supervisor: supervisorRequest
        ? {
            status: supervisorRequest.status,
            name: supervisorRequest.supervisor?.name || null,
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
    console.error("INIT DASHBOARD ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
