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
  },
);

deadlineSchema.index({ dueAt: 1, isGlobal: 1 });

deadlineSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

const Deadline = mongoose.model("Deadline", deadlineSchema);

export default Deadline;
