import mongoose from "mongoose";

const projectTechnologySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    technology: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate technologies per project
projectTechnologySchema.index(
  { project: 1, technology: 1 },
  { unique: true }
);

const ProjectTechnology = mongoose.model(
  "ProjectTechnology",
  projectTechnologySchema
);

export default ProjectTechnology;