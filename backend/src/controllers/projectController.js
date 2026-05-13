import Project from "../database/models/project.model.js";
import GroupMember from "../database/models/groupMember.model.js";
import Assignment from "../database/models/assignment.model.js";
import Deadline from "../database/models/deadline.model.js";

/*  ─────────────────────────────────────────────
    GET /api/projects/:projectId
    Returns a single project overview enriched with:
    - group info + member names
    - supervisor info
    - nearest upcoming deadline (global OR assignment)
    - progress
    - grades (placeholder — extend once Grade model exists)
─────────────────────────────────────────────  */
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const now = new Date();

    /* ── 1. Project ── */
    const project = await Project.findById(projectId)
      .populate("supervisor", "name email")
      .populate("group", "name")
      .lean();

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found." });
    }

    /* ── 2. Group members (with names) ── */
    const groupMembers = await GroupMember.find({ group: project.group._id })
      .populate("student", "name email")
      .lean();

    const members = groupMembers.map((m) => ({
      id: m.student._id.toString(),
      name: m.student.name,
      email: m.student.email,
      role: m.role,
    }));

    /* ── 3. Nearest upcoming global deadline ── */
    const nextGlobalDeadline = await Deadline.findOne({
      isGlobal: true,
      dueAt: { $gte: now },
    })
      .sort({ dueAt: 1 })
      .lean();

    /* ── 4. Nearest upcoming assignment deadline for this project ── */
    const nextAssignment = await Assignment.findOne({
      project: project._id,
      dueDate: { $gte: now },
    })
      .sort({ dueDate: 1 })
      .lean();

    /* ── 5. Pick the sooner deadline ── */
    const globalDue = nextGlobalDeadline?.dueAt;
    const assignmentDue = nextAssignment?.dueDate;

    let chosenDate = null;
    let chosenTitle = null;

    if (globalDue && assignmentDue) {
      if (new Date(globalDue) <= new Date(assignmentDue)) {
        chosenDate = globalDue;
        chosenTitle = nextGlobalDeadline.title;
      } else {
        chosenDate = assignmentDue;
        chosenTitle = nextAssignment.title;
      }
    } else if (globalDue) {
      chosenDate = globalDue;
      chosenTitle = nextGlobalDeadline.title;
    } else if (assignmentDue) {
      chosenDate = assignmentDue;
      chosenTitle = nextAssignment.title;
    }

    let deadlineData = null;
    if (chosenDate) {
      const d = new Date(chosenDate);
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysLeft = Math.max(
        0,
        Math.ceil((d.getTime() - now.getTime()) / msPerDay),
      );

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
        daysLeft,
      };
    }

    /* ── 6. Shape response ── */
    return res.status(200).json({
      success: true,
      data: {
        id: project._id.toString(),
        title: project.title,
        description: project.description || "",
        domain: project.domain || "",
        status: project.status,
        progress: project.progress ?? 0,
        group: {
          id: project.group._id.toString(),
          name: project.group.name,
          memberCount: members.length,
        },
        supervisor: project.supervisor
          ? {
              id: project.supervisor._id.toString(),
              name: project.supervisor.name,
              email: project.supervisor.email,
            }
          : null,
        members, // [{ id, name, email, role }]
        deadline: deadlineData,
        grades: [], // ← wire up once Grade model is ready
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    console.error("getProjectById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project.",
      error: error.message,
    });
  }
};
