import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    meetingUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

meetingSchema.index({ project: 1, scheduledAt: 1 });

meetingSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
