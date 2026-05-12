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
  },
);

panelSupervisorSchema.index({ panel: 1, supervisor: 1 }, { unique: true });

panelSupervisorSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

const PanelSupervisor = mongoose.model(
  "PanelSupervisor",
  panelSupervisorSchema,
);

export default PanelSupervisor;
