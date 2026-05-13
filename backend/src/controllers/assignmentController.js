import Assignment from "../database/models/assignment.model.js";
import AssignmentAttachment from "../database/models/assignmentAttachment.model.js";
import Submission from "../database/models/submission.model.js";
import SubmissionAttachment from "../database/models/submissionAttachment.model.js";
import Project from "../database/models/project.model.js";
import GroupMember from "../database/models/groupMember.model.js";

/* ─────────────────────────────────────────────
   Helper
──────────────────────────────────────────── */
const getProjectAndVerify = async (projectId, userId, role) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: "Project not found", status: 404 };

  if (role === "supervisor") {
    if (project.supervisor.toString() !== userId.toString()) {
      return { error: "Not authorized", status: 403 };
    }
  } else if (role === "student") {
    const member = await GroupMember.findOne({
      group: project.group,
      student: userId,
    });
    if (!member) return { error: "Not authorized", status: 403 };
  }

  return { project };
};

/* ─────────────────────────────────────────────
   GET /projects/:projectId/assignments
   Returns list for stream; each item has id, title, dueDate, description
──────────────────────────────────────────── */
export const getAssignments = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { role, id: userId } = req.user;

    const access = await getProjectAndVerify(projectId, userId, role);
    if (access.error) {
      return res.status(access.status).json({ message: access.error });
    }

    const assignments = await Assignment.find({ project: projectId })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 })
      .lean();

    // Attach attachments for each assignment
    const assignmentIds = assignments.map((a) => a._id);
    const attachments = await AssignmentAttachment.find({
      assignment: { $in: assignmentIds },
    }).lean();

    const attachByAssignment = new Map();
    attachments.forEach((att) => {
      const key = att.assignment.toString();
      if (!attachByAssignment.has(key)) attachByAssignment.set(key, []);
      attachByAssignment.get(key).push({
        id: att._id.toString(),
        fileName: att.fileName,
        fileUrl: att.fileUrl,
      });
    });

    // For students, attach their submission status
    let submissionMap = new Map();
    if (role === "student") {
      const submissions = await Submission.find({
        assignment: { $in: assignmentIds },
        student: userId,
      }).lean();

      submissions.forEach((s) => {
        submissionMap.set(s.assignment.toString(), {
          id: s._id.toString(),
          status: s.status,
          submittedAt: s.submittedAt,
        });
      });
    }

    const formatted = assignments.map((a) => ({
      id: a._id.toString(),
      title: a.title,
      description: a.description || "",
      dueDate: a.dueDate,
      createdAt: a.createdAt,
      createdBy: {
        id: a.createdBy?._id?.toString(),
        name: a.createdBy?.name || "Unknown",
      },
      attachments: attachByAssignment.get(a._id.toString()) || [],
      ...(role === "student" && {
        mySubmission: submissionMap.get(a._id.toString()) || null,
      }),
    }));

    return res.status(200).json({ data: formatted });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching assignments", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   GET /projects/:projectId/assignments/:id
   Full detail view — includes submissions (supervisor) or own submission (student)
──────────────────────────────────────────── */
export const getAssignmentDetail = async (req, res) => {
  try {
    const { projectId, id } = req.params;
    const { role, id: userId } = req.user;

    const access = await getProjectAndVerify(projectId, userId, role);
    if (access.error) {
      return res.status(access.status).json({ message: access.error });
    }

    const assignment = await Assignment.findOne({
      _id: id,
      project: projectId,
    })
      .populate("createdBy", "name role")
      .lean();

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Assignment attachments
    const attachments = await AssignmentAttachment.find({
      assignment: id,
    }).lean();

    const formattedAttachments = attachments.map((a) => ({
      id: a._id.toString(),
      fileName: a.fileName,
      fileUrl: a.fileUrl,
    }));

    let submissionData = null;

    if (role === "student") {
      // Return only the student's own submission
      const submission = await Submission.findOne({
        assignment: id,
        student: userId,
      }).lean();

      if (submission) {
        const subAttachments = await SubmissionAttachment.find({
          submission: submission._id,
        }).lean();

        submissionData = {
          id: submission._id.toString(),
          content: submission.content || "",
          status: submission.status,
          submittedAt: submission.submittedAt,
          attachments: subAttachments.map((sa) => ({
            id: sa._id.toString(),
            fileUrl: sa.fileUrl,
          })),
        };
      }
    } else if (role === "supervisor") {
      // Return all submissions with student info
      const submissions = await Submission.find({ assignment: id })
        .populate("student", "name email")
        .lean();

      const subIds = submissions.map((s) => s._id);
      const subAttachments = await SubmissionAttachment.find({
        submission: { $in: subIds },
      }).lean();

      const subAttachMap = new Map();
      subAttachments.forEach((sa) => {
        const key = sa.submission.toString();
        if (!subAttachMap.has(key)) subAttachMap.set(key, []);
        subAttachMap.get(key).push({
          id: sa._id.toString(),
          fileUrl: sa.fileUrl,
        });
      });

      submissionData = submissions.map((s) => ({
        id: s._id.toString(),
        content: s.content || "",
        status: s.status,
        submittedAt: s.submittedAt,
        student: {
          id: s.student?._id?.toString(),
          name: s.student?.name || "Unknown",
          email: s.student?.email || "",
        },
        attachments: subAttachMap.get(s._id.toString()) || [],
      }));
    }

    return res.status(200).json({
      data: {
        id: assignment._id.toString(),
        title: assignment.title,
        description: assignment.description || "",
        dueDate: assignment.dueDate,
        createdAt: assignment.createdAt,
        createdBy: {
          name: assignment.createdBy?.name || "Unknown",
        },
        attachments: formattedAttachments,
        ...(role === "student" && { mySubmission: submissionData }),
        ...(role === "supervisor" && { submissions: submissionData }),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching assignment", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   POST /projects/:projectId/assignments
   Supervisor only
   Body: { title, description, dueDate, attachments: [{ fileName, fileUrl }] }
──────────────────────────────────────────── */
export const createAssignment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { id: userId } = req.user;
    const { title, description, dueDate, attachments = [] } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.supervisor.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only supervisors can create assignments" });
    }

    const assignment = await Assignment.create({
      project: projectId,
      createdBy: userId,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    // Save attachments if any
    if (attachments.length > 0) {
      const attachDocs = attachments.map((a) => ({
        assignment: assignment._id,
        fileName: a.fileName,
        fileUrl: a.fileUrl,
      }));
      await AssignmentAttachment.insertMany(attachDocs);
    }

    const savedAttachments = await AssignmentAttachment.find({
      assignment: assignment._id,
    }).lean();

    return res.status(201).json({
      message: "Assignment created",
      data: {
        ...assignment.toJSON(),
        attachments: savedAttachments.map((a) => ({
          id: a._id.toString(),
          fileName: a.fileName,
          fileUrl: a.fileUrl,
        })),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating assignment", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   DELETE /projects/:projectId/assignments/:id
   Supervisor only
──────────────────────────────────────────── */
export const deleteAssignment = async (req, res) => {
  try {
    const { projectId, id } = req.params;
    const { id: userId } = req.user;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.supervisor.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const assignment = await Assignment.findOneAndDelete({
      _id: id,
      project: projectId,
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Cascade delete
    await AssignmentAttachment.deleteMany({ assignment: id });

    const submissions = await Submission.find({ assignment: id });
    const subIds = submissions.map((s) => s._id);
    await SubmissionAttachment.deleteMany({ submission: { $in: subIds } });
    await Submission.deleteMany({ assignment: id });

    return res.status(200).json({ message: "Assignment deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting assignment", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   POST /projects/:projectId/assignments/:id/submit
   Student only
   Body: { content?, attachments: [{ fileUrl }] }
──────────────────────────────────────────── */
export const submitAssignment = async (req, res) => {
  try {
    const { projectId, id } = req.params;
    const { id: userId } = req.user;
    const { content = "", attachments = [] } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const member = await GroupMember.findOne({
      group: project.group,
      student: userId,
    });
    if (!member) return res.status(403).json({ message: "Not authorized" });

    const assignment = await Assignment.findOne({
      _id: id,
      project: projectId,
    });
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    // Determine if late
    const now = new Date();
    const isLate = assignment.dueDate && now > assignment.dueDate;

    // Upsert submission
    let submission = await Submission.findOne({
      assignment: id,
      student: userId,
    });

    if (!submission) {
      submission = await Submission.create({
        assignment: id,
        student: userId,
        content,
        submittedAt: now,
        status: isLate ? "late" : "submitted",
      });
    } else {
      submission.content = content;
      submission.submittedAt = now;
      submission.status = isLate ? "late" : "submitted";
      await submission.save();

      // Remove old attachments on resubmit
      await SubmissionAttachment.deleteMany({ submission: submission._id });
    }

    // Save new attachments
    if (attachments.length > 0) {
      const attDocs = attachments.map((a) => ({
        submission: submission._id,
        fileUrl: a.fileUrl,
      }));
      await SubmissionAttachment.insertMany(attDocs);
    }

    const savedAttachments = await SubmissionAttachment.find({
      submission: submission._id,
    }).lean();

    return res.status(200).json({
      message: "Assignment submitted successfully",
      data: {
        ...submission.toJSON(),
        attachments: savedAttachments.map((a) => ({
          id: a._id.toString(),
          fileUrl: a.fileUrl,
        })),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error submitting assignment", error: error.message });
  }
};

/* ─────────────────────────────────────────────
   GET /projects/:projectId/assignments/:id/submissions
   Supervisor only — see all submissions
──────────────────────────────────────────── */
export const getSubmissions = async (req, res) => {
  try {
    const { projectId, id } = req.params;
    const { id: userId } = req.user;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.supervisor.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const submissions = await Submission.find({ assignment: id })
      .populate("student", "name email")
      .lean();

    const subIds = submissions.map((s) => s._id);
    const attachments = await SubmissionAttachment.find({
      submission: { $in: subIds },
    }).lean();

    const attachMap = new Map();
    attachments.forEach((a) => {
      const key = a.submission.toString();
      if (!attachMap.has(key)) attachMap.set(key, []);
      attachMap.get(key).push({ id: a._id.toString(), fileUrl: a.fileUrl });
    });

    const formatted = submissions.map((s) => ({
      id: s._id.toString(),
      content: s.content || "",
      status: s.status,
      submittedAt: s.submittedAt,
      student: {
        id: s.student?._id?.toString(),
        name: s.student?.name || "Unknown",
        email: s.student?.email || "",
      },
      attachments: attachMap.get(s._id.toString()) || [],
    }));

    return res.status(200).json({ data: formatted });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching submissions", error: error.message });
  }
};
