import Material from "../database/models/material.model.js";
import Project from "../database/models/project.model.js";
import GroupMember from "../database/models/groupMember.model.js";

/* ─────────────────────────────────────────────
   GET /projects/:projectId/materials
──────────────────────────────────────────── */
export const getMaterials = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { role, id: userId } = req.user;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Authorization
    if (role === "supervisor") {
      if (project.supervisor.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }
    } else if (role === "student") {
      const member = await GroupMember.findOne({
        group: project.group,
        student: userId,
      });
      if (!member) return res.status(403).json({ message: "Not authorized" });
    }

    const materials = await Material.find({ project: projectId })
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = materials.map((m) => ({
      id: m._id.toString(),
      title: m.title,
      fileUrl: m.fileUrl,
      createdAt: m.createdAt,
      uploadedBy: {
        id: m.uploadedBy?._id?.toString(),
        name: m.uploadedBy?.name || "Unknown",
        role: m.uploadedBy?.role || "",
      },
    }));

    return res.status(200).json({ data: formatted });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching materials", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   POST /projects/:projectId/materials
   Supervisor only
   Body: { title, fileUrl }
   (In production: handle file upload via multer/S3 before this)
──────────────────────────────────────────── */
export const createMaterial = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { id: userId } = req.user;
    const { title, fileUrl } = req.body;

    if (!title || !fileUrl) {
      return res
        .status(400)
        .json({ message: "Title and fileUrl are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.supervisor.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only supervisors can upload materials" });
    }

    const material = await Material.create({
      project: projectId,
      uploadedBy: userId,
      title,
      fileUrl,
    });

    await material.populate("uploadedBy", "name role");

    return res.status(201).json({
      message: "Material uploaded",
      data: material,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating material", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   DELETE /projects/:projectId/materials/:id
   Supervisor only
──────────────────────────────────────────── */
export const deleteMaterial = async (req, res) => {
  try {
    const { projectId, id } = req.params;
    const { id: userId } = req.user;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.supervisor.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const material = await Material.findOneAndDelete({
      _id: id,
      project: projectId,
    });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    return res.status(200).json({ message: "Material deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting material", error: error.message });
  }
};
