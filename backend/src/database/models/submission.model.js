import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      trim: true,
    },

    submittedAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["draft", "submitted", "late"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

// One submission per student per assignment
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

submissionSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
