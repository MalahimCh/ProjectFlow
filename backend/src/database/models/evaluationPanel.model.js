import mongoose from "mongoose";

const evaluationPanelSchema = new mongoose.Schema(
  {
    rubric: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rubric",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phase: {
      type: String,
      enum: ["proposal", "mid", "final", "defense"],
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "active", "completed"],
      default: "scheduled",
    },

    scheduledAt: {
      type: Date,
    },

    room: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const EvaluationPanel = mongoose.model(
  "EvaluationPanel",
  evaluationPanelSchema
);

export default EvaluationPanel;