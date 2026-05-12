import mongoose from "mongoose";

const projectRatingSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    ratedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Each user can rate a project only once
projectRatingSchema.index({ project: 1, user: 1 }, { unique: true });

projectRatingSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

const ProjectRating = mongoose.model("ProjectRating", projectRatingSchema);

export default ProjectRating;
