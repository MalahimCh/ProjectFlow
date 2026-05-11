import mongoose from "mongoose";

const supervisorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    maxWorkload: {
      type: Number,
      default: 5,
      min: 1,
    },

    interests: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SupervisorProfile = mongoose.model(
  "SupervisorProfile",
  supervisorProfileSchema
);

export default SupervisorProfile;