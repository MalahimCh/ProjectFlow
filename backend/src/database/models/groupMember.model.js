import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["leader", "member"],
      default: "member",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce UNIQUE(group_id, student_id)
groupMemberSchema.index(
  { group: 1, student: 1 },
  { unique: true }
);

const GroupMember = mongoose.model(
  "GroupMember",
  groupMemberSchema
);

export default GroupMember;