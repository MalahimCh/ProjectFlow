import mongoose from "mongoose";

const projectEvaluationSchema = new mongoose.Schema(
  {
    panel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluationPanel",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    evaluator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalScore: {
      type: Number,
      required: true,
      min: 0,
    },

    comments: {
      type: String,
      trim: true,
    },

    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

projectEvaluationSchema.index(
  { panel: 1, project: 1, evaluator: 1 },
  { unique: true }
);

const ProjectEvaluation = mongoose.model(
  "ProjectEvaluation",
  projectEvaluationSchema
);

export default ProjectEvaluation;