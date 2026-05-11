import mongoose from "mongoose";

const panelSupervisorSchema = new mongoose.Schema(
  {
    panel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluationPanel",
      required: true,
    },

    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

panelSupervisorSchema.index(
  { panel: 1, supervisor: 1 },
  { unique: true }
);

const PanelSupervisor = mongoose.model(
  "PanelSupervisor",
  panelSupervisorSchema
);

export default PanelSupervisor;