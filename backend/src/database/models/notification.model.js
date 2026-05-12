import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["system", "event", "message", "deadline", "evaluation"],
      default: "system",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    refEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    refEntityType: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Optimized for fetching notifications
notificationSchema.index({
  user: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
