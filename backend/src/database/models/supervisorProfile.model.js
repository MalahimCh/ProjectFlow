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

    specialization: {
      type: String,
      trim: true,
    },

    interests: [
      {
        type: String,
        trim: true,
      },
    ],

    workload: {
      type: Number,
      default: 0,
      min: 0,
      max: 4,
    },
  },
  {
    timestamps: true,
  },
);

const SupervisorProfile = mongoose.model(
  "SupervisorProfile",
  supervisorProfileSchema,
);

export default SupervisorProfile;
