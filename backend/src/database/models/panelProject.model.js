import mongoose from "mongoose";

const panelProjectSchema = new mongoose.Schema(
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

    slotTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

panelProjectSchema.index(
  { panel: 1, project: 1 },
  { unique: true }
);

const PanelProject = mongoose.model(
  "PanelProject",
  panelProjectSchema
);

export default PanelProject;