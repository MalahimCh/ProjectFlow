import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

announcementSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

announcementSchema.index({ project: 1, createdAt: -1 });

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
