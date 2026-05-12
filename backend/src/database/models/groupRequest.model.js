import mongoose from "mongoose";

const groupRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null, // ← was required: true, breaks sendGroupRequest
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

// Remove the old index, replace with:
groupRequestSchema.index(
  { sender: 1, receiver: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "pending" }, // only one pending per pair
  },
);

groupRequestSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

const GroupRequest = mongoose.model("GroupRequest", groupRequestSchema);

export default GroupRequest;
