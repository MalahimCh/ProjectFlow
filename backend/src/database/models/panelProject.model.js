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
  },
);

panelProjectSchema.index({ panel: 1, project: 1 }, { unique: true });

panelProjectSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

const PanelProject = mongoose.model("PanelProject", panelProjectSchema);

export default PanelProject;
