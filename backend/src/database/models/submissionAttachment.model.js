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
  },
);

submissionAttachmentSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});
const SubmissionAttachment = mongoose.model(
  "SubmissionAttachment",
  submissionAttachmentSchema,
);

export default SubmissionAttachment;
