import mongoose from "mongoose";

const submissionAttachmentSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubmissionAttachment = mongoose.model(
  "SubmissionAttachment",
  submissionAttachmentSchema
);

export default SubmissionAttachment;