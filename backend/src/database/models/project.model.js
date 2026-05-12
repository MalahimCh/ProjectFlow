import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    supervisor: {
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

    description: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    domain: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    status: {
      type: String,
      enum: ["proposal", "active", "completed", "archived"],
      default: "proposal",
    },
  },
  {
    timestamps: true,
  },
);

// Helpful indexes
projectSchema.index({ supervisor: 1 });
projectSchema.index({ domain: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ group: 1 });

projectSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
