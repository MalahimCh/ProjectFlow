import Project from "../../database/models/project.model.js";
import GroupMember from "../../database/models/groupMember.model.js";
import Meeting from "../../database/models/meeting.model.js";
import Deadline from "../../database/models/deadline.model.js";
import SupervisorRequest from "../../database/models/supervisorRequest.model.js";

/* ─────────────────────────────────────────────
   GET /api/supervisor/dashboard
   Returns all data for the supervisor dashboard
   in a single request:
   - stats (activeGroups, pendingRequests, upcomingMeetings, totalStudents)
   - activeProjects (with group name + progress)
   - upcomingDeadlines (global, within next 7 days)
   - upcomingMeetings (across all projects, within next 7 days)
──────────────────────────────────────────── */
export const getSupervisorDashboard = async (req, res) => {
  try {
    const supervisorId = req.user.id;
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    /* ── 1. All projects this supervisor owns ── */
    const projects = await Project.find({ supervisor: supervisorId })
      .populate("group", "name")
      .lean();

    const projectIds = projects.map((p) => p._id);
    const groupIds = projects.map((p) => p.group._id);

    /* ── 2. Total unique students across all groups ── */
    const members = await GroupMember.find({
      group: { $in: groupIds },
    })
      .populate("student", "name")
      .lean();

    const uniqueStudentIds = new Set(
      members.map((m) => m.student?._id?.toString()).filter(Boolean),
    );

    /* ── 3. Pending supervisor requests ── */
    const pendingRequests = await SupervisorRequest.countDocuments({
      supervisor: supervisorId,
      status: "pending",
    });

    /* ── 4. Upcoming meetings (next 7 days across all projects) ── */
    const upcomingMeetings = await Meeting.find({
      project: { $in: projectIds },
      scheduledAt: { $gte: now, $lte: in7Days },
    })
      .populate("project", "title group")
      .sort({ scheduledAt: 1 })
      .lean();

    /* ── 5. Upcoming global deadlines (next 7 days) ── */
    const upcomingDeadlines = await Deadline.find({
      isGlobal: true,
      dueAt: { $gte: now, $lte: in7Days },
    })
      .sort({ dueAt: 1 })
      .lean();

    /* ── 6. Build project name map for meetings ── */
    const projectNameMap = new Map(
      projects.map((p) => [p._id.toString(), p.title]),
    );

    /* ── 7. Format active projects for the grid ── */
    const activeProjects = projects
      .filter((p) => p.status !== "archived")
      .map((p) => ({
        id: p._id.toString(),
        groupName: p.group?.name || p.title,
        projectTitle: p.title,
        domain: p.domain || "",
        status: p.status,
        progress: p.progress ?? 0,
      }));

    /* ── 8. Format meetings ── */
    const formattedMeetings = upcomingMeetings.map((m) => ({
      id: m._id.toString(),
      meetingType: m.title,
      projectName: projectNameMap.get(m.project?._id?.toString()) || "Unknown",
      projectId: m.project?._id?.toString(),
      datetime: m.scheduledAt,
      meetingUrl: m.meetingUrl || null,
      description: m.description || "",
    }));

    /* ── 9. Format deadlines ── */
    const formattedDeadlines = upcomingDeadlines.map((d) => ({
      id: d._id.toString(),
      deadlineType: d.title,
      description: d.description || "",
      datetime: d.dueAt,
    }));

    /* ── 10. Stats ── */
    const stats = {
      activeGroups: projects.filter((p) => p.status !== "archived").length,
      pendingRequests,
      upcomingMeetings: upcomingMeetings.length,
      totalStudents: uniqueStudentIds.size,
    };

    return res.status(200).json({
      data: {
        stats,
        activeProjects,
        upcomingDeadlines: formattedDeadlines,
        upcomingMeetings: formattedMeetings,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching supervisor dashboard",
      error: error.message,
    });
  }
};
