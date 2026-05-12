import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
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
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
    },

    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

assignmentSchema.index({ project: 1, dueDate: 1 });

assignmentSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});
const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
