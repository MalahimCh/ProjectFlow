import mongoose from "mongoose";

const assignmentAttachmentSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const AssignmentAttachment = mongoose.model(
  "AssignmentAttachment",
  assignmentAttachmentSchema
);

export default AssignmentAttachment;