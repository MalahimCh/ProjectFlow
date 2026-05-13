import Meeting from "../database/models/meeting.model.js";
import Project from "../database/models/project.model.js";
import Group from "../database/models/group.model.js";
import GroupMember from "../database/models/groupMember.model.js";

/**
 * STUDENT:
 * Get all meetings of the student's project
 */
export const getStudentMeetings = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Find student's group
    const membership = await GroupMember.findOne({
      student: studentId,
    }).lean();

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "You are not part of any group.",
      });
    }

    // Find project for that group
    const project = await Project.findOne({
      group: membership.group,
    })
      .populate("supervisor", "name email")
      .lean();

    if (!project) {
      return res.json({
        success: true,
        data: {
          project: null,
          meetings: [],
        },
      });
    }

    // Get meetings
    const meetings = await Meeting.find({
      project: project._id,
    })
      .populate("createdBy", "name email")
      .sort({ scheduledAt: 1 })
      .lean();

    const formattedMeetings = meetings.map((m) => ({
      id: m._id.toString(),
      title: m.title,
      description: m.description || "",
      scheduledAt: m.scheduledAt,
      meetingUrl: m.meetingUrl || "",
      createdAt: m.createdAt,
      createdBy: m.createdBy,
    }));

    return res.json({
      success: true,
      data: {
        project: {
          id: project._id.toString(),
          title: project.title,
          supervisor: project.supervisor,
        },
        meetings: formattedMeetings,
      },
    });
  } catch (error) {
    console.error("getStudentMeetings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meetings.",
    });
  }
};

/**
 * STUDENT:
 * Create meeting for student's project
 */
export const createStudentMeeting = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { title, description, scheduledAt, meetingUrl } = req.body;

    if (!title || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Title and scheduledAt are required.",
      });
    }

    // Find student's group
    const membership = await GroupMember.findOne({
      student: studentId,
    }).lean();

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "You are not part of any group.",
      });
    }

    // Find project
    const project = await Project.findOne({
      group: membership.group,
    }).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No project found for your group.",
      });
    }

    const meeting = await Meeting.create({
      project: project._id,
      createdBy: studentId,
      title,
      description,
      scheduledAt,
      meetingUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Meeting created successfully.",
      data: meeting.toJSON(),
    });
  } catch (error) {
    console.error("createStudentMeeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create meeting.",
    });
  }
};

/**
 * SUPERVISOR:
 * Get all meetings of all projects supervised by current supervisor
 */
export const getSupervisorMeetings = async (req, res) => {
  try {
    const supervisorId = req.user.id;

    // Get all supervisor projects
    const projects = await Project.find({
      supervisor: supervisorId,
    })
      .select("title")
      .lean();

    const projectIds = projects.map((p) => p._id);

    if (projectIds.length === 0) {
      return res.json({
        success: true,
        data: {
          projects: [],
          meetings: [],
        },
      });
    }

    // Get meetings
    const meetings = await Meeting.find({
      project: { $in: projectIds },
    })
      .populate("project", "title")
      .populate("createdBy", "name email")
      .sort({ scheduledAt: 1 })
      .lean();

    const formattedMeetings = meetings.map((m) => ({
      id: m._id.toString(),
      project: {
        id: m.project._id.toString(),
        title: m.project.title,
      },
      title: m.title,
      description: m.description || "",
      scheduledAt: m.scheduledAt,
      meetingUrl: m.meetingUrl || "",
      createdAt: m.createdAt,
      createdBy: m.createdBy,
    }));

    return res.json({
      success: true,
      data: {
        projects: projects.map((p) => ({
          id: p._id.toString(),
          title: p.title,
        })),
        meetings: formattedMeetings,
      },
    });
  } catch (error) {
    console.error("getSupervisorMeetings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meetings.",
    });
  }
};

/**
 * SUPERVISOR:
 * Create meeting for one of supervisor's projects
 */
export const createSupervisorMeeting = async (req, res) => {
  try {
    const supervisorId = req.user.id;
    const { projectId, title, description, scheduledAt, meetingUrl } = req.body;

    if (!projectId || !title || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "projectId, title and scheduledAt are required.",
      });
    }

    // Verify project belongs to this supervisor
    const project = await Project.findOne({
      _id: projectId,
      supervisor: supervisorId,
    }).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized.",
      });
    }

    const meeting = await Meeting.create({
      project: project._id,
      createdBy: supervisorId,
      title,
      description,
      scheduledAt,
      meetingUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Meeting created successfully.",
      data: meeting.toJSON(),
    });
  } catch (error) {
    console.error("createSupervisorMeeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create meeting.",
    });
  }
};
/**
 * STUDENT + SUPERVISOR:
 * Update a meeting
 *
 * Rules:
 * - User must belong to / supervise the project.
 * - User can update ONLY meetings they created themselves.
 */
export const updateMeeting = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role; // "student" | "supervisor"
    const { meetingId } = req.params;
    const { title, description, scheduledAt, meetingUrl } = req.body;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    // ✅ Only creator can update
    if (meeting.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update meetings created by you.",
      });
    }

    const project = await Project.findById(meeting.project).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Associated project not found.",
      });
    }

    // Additional authorization check
    if (userRole === "student") {
      const membership = await GroupMember.findOne({
        student: userId,
        group: project.group,
      }).lean();

      if (!membership) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this meeting.",
        });
      }
    } else if (userRole === "supervisor") {
      if (project.supervisor.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this meeting.",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role.",
      });
    }

    // Update only provided fields
    if (title !== undefined) meeting.title = title;
    if (description !== undefined) meeting.description = description;
    if (scheduledAt !== undefined) meeting.scheduledAt = scheduledAt;
    if (meetingUrl !== undefined) meeting.meetingUrl = meetingUrl;

    await meeting.save();

    await meeting.populate([
      { path: "project", select: "title" },
      { path: "createdBy", select: "name email" },
    ]);

    return res.json({
      success: true,
      message: "Meeting updated successfully.",
      data: meeting.toJSON(),
    });
  } catch (error) {
    console.error("updateMeeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update meeting.",
    });
  }
};

/**
 * STUDENT + SUPERVISOR:
 * Delete a meeting
 *
 * Rules:
 * - User must belong to / supervise the project.
 * - User can delete ONLY meetings they created themselves.
 */
export const deleteMeeting = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    // ✅ Only creator can delete
    if (meeting.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete meetings created by you.",
      });
    }

    const project = await Project.findById(meeting.project).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Associated project not found.",
      });
    }

    // Additional authorization check
    if (userRole === "student") {
      const membership = await GroupMember.findOne({
        student: userId,
        group: project.group,
      }).lean();

      if (!membership) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this meeting.",
        });
      }
    } else if (userRole === "supervisor") {
      if (project.supervisor.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this meeting.",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role.",
      });
    }

    await Meeting.findByIdAndDelete(meetingId);

    return res.json({
      success: true,
      message: "Meeting deleted successfully.",
    });
  } catch (error) {
    console.error("deleteMeeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete meeting.",
    });
  }
};
