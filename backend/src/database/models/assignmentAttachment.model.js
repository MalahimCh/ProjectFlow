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
  },
);

assignmentAttachmentSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});
const AssignmentAttachment = mongoose.model(
  "AssignmentAttachment",
  assignmentAttachmentSchema,
);

export default AssignmentAttachment;
