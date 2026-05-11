import mongoose from "mongoose";

const supervisorRequestSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: prevent duplicate pending requests to same supervisor
supervisorRequestSchema.index(
  { group: 1, supervisor: 1 },
  { unique: true }
);

const SupervisorRequest = mongoose.model(
  "SupervisorRequest",
  supervisorRequestSchema
);

export default SupervisorRequest;