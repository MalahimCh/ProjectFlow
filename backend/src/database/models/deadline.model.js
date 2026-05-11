import mongoose from "mongoose";

const deadlineSchema = new mongoose.Schema(
  {
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

    dueAt: {
      type: Date,
      required: true,
    },

    isGlobal: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

deadlineSchema.index({ dueAt: 1, isGlobal: 1 });

const Deadline = mongoose.model("Deadline", deadlineSchema);

export default Deadline;