import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    gpa: {
      type: Number,
      min: 0,
      max: 4.0,
    },

    interests: [
      {
        type: String,
        trim: true,
      },
    ],

    batchYear: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

studentProfileSchema.index({ roll_number: 1 }, { unique: true });


const StudentProfile = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);

export default StudentProfile;