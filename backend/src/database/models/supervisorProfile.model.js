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

supervisorProfileSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

const SupervisorProfile = mongoose.model(
  "SupervisorProfile",
  supervisorProfileSchema,
);

export default SupervisorProfile;
