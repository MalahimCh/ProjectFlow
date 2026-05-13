import Project from "../../database/models/project.model.js";
import GroupMember from "../../database/models/groupMember.model.js";
import Assignment from "../../database/models/assignment.model.js";
import Deadline from "../../database/models/deadline.model.js";

/* ─────────────────────────────────────────────
   GET /api/supervisor/projects
   Returns all projects supervised by the logged-in
   supervisor, enriched with:
   - group name + member count
   - supervisor info
   - nearest upcoming deadline (global OR assignment due date)
   - progress
   Plus summary stats for the top cards.
──────────────────────────────────────────── */
export const getSupervisorProjects = async (req, res) => {
  try {
    const supervisorId = req.user.id;
    const now = new Date();

    /* ── 1. All projects for this supervisor ── */
    const projects = await Project.find({ supervisor: supervisorId })
      .populate("group", "name")
      .populate("supervisor", "name email")
      .sort({ createdAt: -1 })
      .lean();

    if (projects.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          stats: {
            totalGroups: 0,
            totalStudents: 0,
            upcomingDeadlines: 0,
            laggingGroups: 0,
          },
          projects: [],
        },
      });
    }

    const projectIds = projects.map((p) => p._id);
    const groupIds = projects.map((p) => p.group._id);

    /* ── 2. Member counts per group ── */
    const members = await GroupMember.find({ group: { $in: groupIds } }).lean();

    const memberCountByGroup = new Map();
    members.forEach((m) => {
      const key = m.group.toString();
      memberCountByGroup.set(key, (memberCountByGroup.get(key) || 0) + 1);
    });

    /* ── 3. Nearest upcoming global deadline ── */
    const nextGlobalDeadline = await Deadline.findOne({
      isGlobal: true,
      dueAt: { $gte: now },
    })
      .sort({ dueAt: 1 })
      .lean();

    /* ── 4. Nearest upcoming assignment due date per project ── */
    const upcomingAssignments = await Assignment.find({
      project: { $in: projectIds },
      dueDate: { $gte: now },
    })
      .sort({ dueDate: 1 })
      .lean();

    // Map: projectId → earliest upcoming assignment
    const nextAssignmentByProject = new Map();
    upcomingAssignments.forEach((a) => {
      const key = a.project.toString();
      if (!nextAssignmentByProject.has(key)) {
        nextAssignmentByProject.set(key, a);
      }
    });

    const msPerDay = 1000 * 60 * 60 * 24;

    /* ── 5. Format each project ── */
    const formatted = projects.map((p) => {
      const groupKey = p.group._id.toString();
      const memberCount = memberCountByGroup.get(groupKey) || 0;

      // Pick the sooner of: global deadline vs next assignment due
      const globalDue = nextGlobalDeadline?.dueAt;
      const assignmentDue = nextAssignmentByProject.get(
        p._id.toString(),
      )?.dueDate;
      const assignmentTitle = nextAssignmentByProject.get(
        p._id.toString(),
      )?.title;

      let chosenDate = null;
      let chosenTitle = null;

      if (globalDue && assignmentDue) {
        if (new Date(globalDue) <= new Date(assignmentDue)) {
          chosenDate = globalDue;
          chosenTitle = nextGlobalDeadline.title;
        } else {
          chosenDate = assignmentDue;
          chosenTitle = assignmentTitle;
        }
      } else if (globalDue) {
        chosenDate = globalDue;
        chosenTitle = nextGlobalDeadline.title;
      } else if (assignmentDue) {
        chosenDate = assignmentDue;
        chosenTitle = assignmentTitle;
      }

      let deadlineData = null;
      if (chosenDate) {
        const d = new Date(chosenDate);
        const daysLeft = Math.ceil((d.getTime() - now.getTime()) / msPerDay);

        deadlineData = {
          type: chosenTitle,
          dueDate: d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: d.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          daysLeft: Math.max(0, daysLeft),
        };
      }

      return {
        id: p._id.toString(),
        title: p.title,
        description: p.description || "",
        domain: p.domain || "",
        status: p.status,
        group: p.group
          ? {
              id: p.group._id.toString(),
              name: p.group.name,
              memberCount,
            }
          : null,
        supervisor: p.supervisor
          ? {
              id: p.supervisor._id.toString(),
              name: p.supervisor.name,
              email: p.supervisor.email,
            }
          : null,
        members: memberCount,
        progress: p.progress ?? 0,
        deadline: deadlineData,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    /* ── 6. Summary stats ── */
    const totalStudents = members.length;
    const upcomingDeadlines = formatted.filter(
      (p) => p.deadline !== null,
    ).length;
    const laggingGroups = formatted.filter((p) => p.progress < 50).length;

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalGroups: formatted.length,
          totalStudents,
          upcomingDeadlines,
          laggingGroups,
        },
        projects: formatted,
      },
    });
  } catch (error) {
    console.error("getSupervisorProjects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch supervisor projects.",
      error: error.message,
    });
  }
};
