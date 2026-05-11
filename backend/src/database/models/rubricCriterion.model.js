import mongoose from "mongoose";

const rubricCriterionSchema = new mongoose.Schema(
  {
    rubric: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rubric",
      required: true,
    },

    criterionName: {
      type: String,
      required: true,
      trim: true,
    },

    marksAllocated: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const RubricCriterion = mongoose.model(
  "RubricCriterion",
  rubricCriterionSchema
);

export default RubricCriterion;