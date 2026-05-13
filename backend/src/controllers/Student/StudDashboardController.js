import GroupMember from "../../database/models/groupMember.model.js";
import GroupRequest from "../../database/models/groupRequest.model.js";
import SupervisorRequest from "../../database/models/supervisorRequest.model.js";
import StudentProfile from "../../database/models/studentProfile.model.js";
import Project from "../../database/models/project.model.js";
import Group from "../../database/models/group.model.js";
import Announcement from "../../database/models/announcement.model.js";
import Deadline from "../../database/models/deadline.model.js";
import Assignment from "../../database/models/assignment.model.js";
import Submission from "../../database/models/submission.model.js";

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

/* ─────────────────────────────────────────────
   GET /api/student/dashboard
   Returns everything the student dashboard needs in one call:
   - project overview (title, domain, supervisor, progress, team)
   - stats (progress, pendingTasks, scheduledMeetings)
   - upcoming deadlines (global deadlines + assignment due dates)
   - recent announcements (from their project)
──────────────────────────────────────────── */
export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    /* ── 1. Find the student's group membership ── */
    const membership = await GroupMember.findOne({ student: studentId })
      .populate("group")
      .lean();

    if (!membership) {
      // Student has no group yet — return empty state
      return res.status(200).json({
        data: {
          hasProject: false,
          project: null,
          stats: { progress: 0, pendingTasks: 0, meetings: 0 },
          deadlines: [],
          announcements: [],
        },
      });
    }

    const group = membership.group;

    /* ── 2. Find the project for this group ── */
    const project = await Project.findOne({ group: group._id })
      .populate("supervisor", "name email")
      .lean();

    if (!project) {
      return res.status(200).json({
        data: {
          hasProject: false,
          project: null,
          stats: { progress: 0, pendingTasks: 0, meetings: 0 },
          deadlines: [],
          announcements: [],
        },
      });
    }

    /* ── 3. Get all group members ── */
    const members = await GroupMember.find({ group: group._id })
      .populate("student", "name")
      .lean();

    const teamNames = members.map((m) => m.student?.name || "Unknown");

    /* ── 4. Get student profile for rollNumber etc ── */
    const studentProfile = await StudentProfile.findOne({
      user: studentId,
    }).lean();

    /* ── 5. Upcoming deadlines ──
       Combine:
         a) Global deadlines (isGlobal: true, dueAt in future)
         b) Assignment due dates for this project (dueDate in future, not yet submitted)
    ── */
    const now = new Date();

    const [globalDeadlines, assignments] = await Promise.all([
      Deadline.find({ isGlobal: true, dueAt: { $gte: now } })
        .sort({ dueAt: 1 })
        .limit(5)
        .lean(),
      Assignment.find({
        project: project._id,
        dueDate: { $gte: now },
      })
        .sort({ dueDate: 1 })
        .limit(5)
        .lean(),
    ]);

    // Check which assignments are already submitted by this student
    const assignmentIds = assignments.map((a) => a._id);
    const submissions = await Submission.find({
      assignment: { $in: assignmentIds },
      student: studentId,
      status: { $in: ["submitted", "late"] },
    }).lean();

    const submittedIds = new Set(
      submissions.map((s) => s.assignment.toString()),
    );

    const msPerDay = 1000 * 60 * 60 * 24;

    const deadlinesFromGlobal = globalDeadlines.map((d) => ({
      id: d._id.toString(),
      title: d.title,
      due: new Date(d.dueAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      dueAt: d.dueAt,
      daysLeft: Math.ceil((new Date(d.dueAt) - now) / msPerDay),
      type: "global",
    }));

    const deadlinesFromAssignments = assignments
      .filter((a) => !submittedIds.has(a._id.toString()))
      .map((a) => ({
        id: a._id.toString(),
        title: a.title,
        due: new Date(a.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        dueAt: a.dueDate,
        daysLeft: Math.ceil((new Date(a.dueDate) - now) / msPerDay),
        type: "assignment",
        assignmentId: a._id.toString(),
        projectId: project._id.toString(),
      }));

    // Merge and sort by dueAt, take top 5
    const allDeadlines = [...deadlinesFromGlobal, ...deadlinesFromAssignments]
      .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
      .slice(0, 5);

    /* ── 6. Pending tasks = unsubmitted assignments (past + future) ── */
    const allAssignments = await Assignment.find({
      project: project._id,
    }).lean();

    const allSubmissions = await Submission.find({
      assignment: { $in: allAssignments.map((a) => a._id) },
      student: studentId,
      status: { $in: ["submitted", "late"] },
    }).lean();

    const allSubmittedIds = new Set(
      allSubmissions.map((s) => s.assignment.toString()),
    );

    const pendingTasks = allAssignments.filter(
      (a) => !allSubmittedIds.has(a._id.toString()),
    ).length;

    /* ── 7. Recent announcements (last 5 from project) ── */
    const announcements = await Announcement.find({ project: project._id })
      .populate("postedBy", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formattedAnnouncements = announcements.map((a) => ({
      id: a._id.toString(),
      title: a.title,
      body: a.body,
      postedAt: formatRelativeTime(a.createdAt),
      createdAt: a.createdAt,
    }));

    /* ── 8. Progress (kept as project field for now; extend later) ── */
    const progress = project.progress ?? 0; // add progress field to Project model if needed

    /* ── 9. Assemble response ── */
    return res.status(200).json({
      data: {
        hasProject: true,
        student: {
          rollNumber: studentProfile?.rollNumber || "",
        },
        project: {
          id: project._id.toString(),
          title: project.title,
          domain: project.domain || "",
          status: project.status,
          supervisor: project.supervisor?.name || "Not assigned",
          supervisorEmail: project.supervisor?.email || "",
          team: teamNames,
          progress,
        },
        stats: {
          progress,
          pendingTasks,
          meetings: 0, // extend with a Meeting model when available
        },
        deadlines: allDeadlines,
        announcements: formattedAnnouncements,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching dashboard",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────
   Helper: human-readable relative time
──────────────────────────────────────────── */
function formatRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// controller function
// GET /api/student/project-id

export const getStudentProjectId = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Find student's group
    const membership = await GroupMember.findOne({
      student: studentId,
    }).lean();

    if (!membership) {
      return res.status(200).json({
        success: true,
        data: {
          hasProject: false,
          projectId: null,
        },
      });
    }

    // Find project assigned to this group
    const project = await Project.findOne({
      group: membership.group,
    })
      .select("_id")
      .lean();

    if (!project) {
      return res.status(200).json({
        success: true,
        data: {
          hasProject: false,
          projectId: null,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        hasProject: true,
        projectId: project._id.toString(),
      },
    });
  } catch (error) {
    console.error("GET STUDENT PROJECT ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student project ID",
    });
  }
};
