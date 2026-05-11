import mongoose from "mongoose";

const criterionScoreSchema = new mongoose.Schema(
  {
    evaluation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectEvaluation",
      required: true,
    },

    criterion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RubricCriterion",
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

criterionScoreSchema.index(
  { evaluation: 1, criterion: 1 },
  { unique: true }
);

const CriterionScore = mongoose.model(
  "CriterionScore",
  criterionScoreSchema
);

export default CriterionScore;