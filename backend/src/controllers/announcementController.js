import Announcement from "../database/models/announcement.model.js";
import Project from "../database/models/project.model.js";
import GroupMember from "../database/models/groupMember.model.js";

/* ─────────────────────────────────────────────
   Helper: verify user belongs to project
──────────────────────────────────────────── */
const verifyProjectAccess = async (projectId, userId, role) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: "Project not found", status: 404 };

  if (role === "supervisor") {
    if (project.supervisor.toString() !== userId.toString()) {
      return { error: "Not authorized", status: 403 };
    }
  }

  if (role === "student") {
    const member = await GroupMember.findOne({
      group: project.group,
      student: userId,
    });
    if (!member) return { error: "Not authorized", status: 403 };
  }

  return { project };
};

/* ─────────────────────────────────────────────
   GET /projects/:projectId/announcements
──────────────────────────────────────────── */
export const getAnnouncements = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { role, id: userId } = req.user;

    const access = await verifyProjectAccess(projectId, userId, role);
    if (access.error) {
      return res.status(access.status).json({ message: access.error });
    }

    const announcements = await Announcement.find({ project: projectId })
      .populate("postedBy", "name role")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = announcements.map((a) => ({
      id: a._id.toString(),
      title: a.title,
      body: a.body,
      createdAt: a.createdAt,
      postedBy: {
        id: a.postedBy?._id?.toString(),
        name: a.postedBy?.name || "Unknown",
        role: a.postedBy?.role || "",
      },
    }));

    return res.status(200).json({ data: formatted });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching announcements", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   POST /projects/:projectId/announcements
   Supervisor only
──────────────────────────────────────────── */
export const createAnnouncement = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { id: userId } = req.user;
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.supervisor.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only supervisors can post announcements" });
    }

    const announcement = await Announcement.create({
      project: projectId,
      postedBy: userId,
      title,
      body,
    });

    await announcement.populate("postedBy", "name role");

    return res.status(201).json({
      message: "Announcement created",
      data: announcement,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating announcement", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   DELETE /projects/:projectId/announcements/:id
   Supervisor only
──────────────────────────────────────────── */
export const deleteAnnouncement = async (req, res) => {
  try {
    const { projectId, id } = req.params;
    const { id: userId } = req.user;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.supervisor.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const announcement = await Announcement.findOneAndDelete({
      _id: id,
      project: projectId,
    });

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    return res.status(200).json({ message: "Announcement deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting announcement", error: error.message });
  }
};
